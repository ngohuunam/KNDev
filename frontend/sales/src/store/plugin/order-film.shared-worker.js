import io from 'socket.io-client'
import { Store, get } from 'idb-keyval'
import initRxDB from './rxdb'
import schema from './schema/order-film.RxSchema'
import tools from '../../tools'

const user_store = new Store('kn', 'data')
let user, socket
const ports = []
let RxCollection, RxReplicationState

let ready = false
let list = []

const { console, location } = self

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload) => postMessage({ action: 'commit', type: `Order/Film/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = () => {
  return get('user', user_store).then(_info => {
    if (_info) {
      user = _info
      console.log('user', user)
      const { dept, page, token } = user
      const url = `${location.origin}/${dept}/${page}?token=${token}`
      initSocketIo(url)
      initRxDB('order', 'film', schema, token, 'orders_film_2020').then(db => {
        RxCollection = db.col
        RxReplicationState = db.replicationState
        list = db.docs
        console.log('RxCollection: ', RxCollection)
        console.log('RxReplicationState: ', RxReplicationState)
        console.log('list: ', list)
        if (list.length) commit('setState', { key: 'list', data: list })
        RxReplicationState.change$.subscribe(change => console.log('change$: ', change))
        RxReplicationState.docs$.subscribe(docData => {
          console.log('docs$: ', docData)
          if (!docData._deleted) commit('push_sort', { key: 'list', data: docData, sortKey: '_id' })
        })
        RxReplicationState.denied$.subscribe(docData => console.log('denied$: ', docData))
        RxReplicationState.active$.subscribe(active => console.log('active$: ', active))
        RxReplicationState.alive$.subscribe(alive => console.log('alive$: ', alive))
        RxReplicationState.error$.subscribe(error => console.error('error$: ', error))
        ready = true
        commit('setState', { key: 'loading', data: false })
        RxCollection.preInsert(docObj => {
          docObj.createdAt = Date.now()
          docObj.createdBy = user._id
          docObj.logs.unshift({ type: 'Create', at: docObj.createdAt, by: user._id, note: docObj.note })
          delete docObj.note
        }, true)
      })
    } else if (self.location.pathname) {
      console.log(self.location.pathname)
      const _path = self.location.pathname
      const _end = _path.lastIndexOf('/')
      const _start = _path.lastIndexOf('/', _end - 1)
      const _token = _path.slice(_start + 1, _end)
      console.log('_token: ', _token)
    }
  })
}

const initSocketIo = url => {
  socket = io(url)
  socket.on('connect', () => commitRoot('setStates', { keys: ['socket', 'user', 'loading'], datas: [socket.id, user, false] }))
  socket.on('connect_error', error => console.error(error))
  socket.on('connect_timeout', timeout => console.error(new Error({ message: 'timeout', timeout: timeout })))
  socket.on('error', error => console.error(error))
  socket.on('disconnect', () => postMessage({ type: 'disconnect' }))
  socket.on('reload', () => postMessage({ action: 'reload' }))
}

// init()
//   .then()
//   .catch(e => console.error(e))

self.onconnect = e => {
  console.dir(e)
  const port = e.ports[0]
  console.dir(port)
  ports.push(port)

  port.onmessage = ({ data }) => {
    console.log('port.onmessage data: ', data)
    const { name, payload } = data
    if (func[name]) func[name](payload)
    else socket.emit(name, payload)
  }

  port.onmessageerror = e => {
    console.error('sw port onmessageerror', e)
  }
}

const getStatus = () =>
  ready
    ? commitRoot('setStates', { keys: ['socket', 'user', 'loading'], datas: [socket.id, user, false] })
    : init()
        .then()
        .catch(e => console.error(e))

const newOrder = order => {
  return RxCollection.insert(order)
    .then(_doc => {
      console.log(_doc)
      commit('push_sort', { key: 'list', data: _doc.toJSON(), sortKey: '_id' })
      commit('setStates', { keys: ['newOrder', 'newOrderConverted'], datas: [null, null] })
      commitCloseDialog('Create')
      return _doc
    })
    .catch(e => console.error(e))
}

const newOrders = orders => {
  const _newOrders = orders.map(o => tools.newOrder({ ...o }))
  return Promise.all(_newOrders.map(_newOrder => newOrder(_newOrder)))
    .then(_docs => {
      console.log('newOrders _docs: ', _docs)
      _docs.map(_doc => commit('push_sort', { key: 'list', data: _doc.toJSON(), sortKey: '_id' }))
      commitCloseDialog('Delete')
    })
    .catch(e => console.error(e))
}

const dropOrders = ({ docs, note }) => {
  Promise.all(
    docs.map(order => {
      const edited = { ...order, ...{ dropped: Date.now() } }
      edited.logs.unshift({ type: 'Drop', at: Date.now(), by: user._id, note: note })
      return RxCollection.upsert(edited)
    }),
  )
    .then(_docs => {
      console.log('deleteOrders _docs: ', _docs)
      commit('deleteOrdersOk', { _ids: _docs.map(d => d._id) })
      commitCloseDialog('Delete')
    })
    .catch(e => console.error(e))
}

const commitCloseDialog = mess => {
  commitRoot('Dialog/setState', { key: 'loading', data: false })
  commitRoot('Dialog/setMess', { text: `${mess} Success`, severity: 'success' })
  setTimeout(() => {
    commitRoot('Dialog/setMess', { text: '', severity: '' })
    commitRoot('Dialog/setState', { key: 'isOpen', data: false })
  }, 1000)
}

const func = { init, getStatus, newOrder, newOrders, dropOrders }
