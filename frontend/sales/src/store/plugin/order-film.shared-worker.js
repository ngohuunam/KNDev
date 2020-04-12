import io from 'socket.io-client'
import { Store, get } from 'idb-keyval'
import initRxDB from './rxdb'
import schema from './schema/order-film.RxSchema'
import { pushSortBy_id, newOrder as repareNewOrder, queryBy_id, year, filter_rev } from '../../tools'

const { console, location } = self

const user_store = new Store('kn', 'data')
let rxUser, socket, ui, user
let list = []
const ports = []
let RxCollection, RxReplicationState
let ready = false

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload) => postMessage({ action: 'commit', type: `Order/Film/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = () => {
  return get('user', user_store)
    .then(_info => {
      if (_info) {
        console.log('user', _info)
        const { dept, page, token, _id } = _info
        const url = `${location.origin}/${dept}/${page}?token=${token}`
        initRxDB('order', 'film', schema, token, _id, 'orders_film_2020').then(db => {
          db.col.database.waitForLeadership().then(() => console.log('isLeader now'))
          RxCollection = db.col
          RxReplicationState = db.replicationState
          rxUser = db.user
          user = rxUser.toJSON()
          ui = user.state[year].order.film.ui
          console.log('rxUser', rxUser)
          console.log('ui: ', ui)
          list = db.json.reduce((acc, current) => {
            const _key = current._id
            if (ui[_key]) current.ui = ui[_key]
            if (current.dropped && !current.ui) return acc
            acc.push(current)
            return acc
          }, [])
          console.log('RxCollection: ', RxCollection)
          console.log('list: ', list)
          RxReplicationState.change$.subscribe(changeObj => {
            console.log('change$: ', changeObj)
            // commit('setSeq', changeObj.change.last_seq)
          })
          RxReplicationState.denied$.subscribe(docData => console.log('denied$: ', docData))
          RxReplicationState.error$.subscribe(error => console.error('error$: ', error))

          RxCollection.insert$.subscribe(subscribeInsert)
          RxCollection.update$.subscribe(subscribeUpdate)
          RxCollection.preInsert(preInsert, true)

          rxUser.collection.update$.subscribe(changeEvent => {
            console.log('rxUser update$: ', changeEvent)
            if (changeEvent.data.db === 'remote') {
              user = { ...changeEvent.data.v }
              ui = user.state[year].order.film.ui
              list = list.reduce((acc, current) => {
                const _key = current._id
                if (ui[_key]) current.ui = ui[_key]
                else if (!ui[_key] && current.ui) delete current.ui
                if (current.dropped && !current.ui) return acc
                acc.push(current)
                return acc
              }, [])
              commit('setState', { key: 'list', data: list })
            }
          })

          commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
          initSocketIo(url)
          ready = true
        })
      } else if (location.pathname) {
        console.log(location.pathname)
        const _path = location.pathname
        const _end = _path.lastIndexOf('/')
        const _start = _path.lastIndexOf('/', _end - 1)
        const _token = _path.slice(_start + 1, _end)
        console.log('_token: ', _token)
      }
    })
    .catch(e => console.error(e))
}

const initSocketIo = url => {
  const cloneUser = { ...user }
  delete cloneUser.password
  socket = io(url)
  socket.on('connect', () => commitRoot('setStates', { keys: ['socket', 'user', 'loading'], datas: [socket.id, cloneUser, false] }))
  socket.on('connect_error', error => console.error(error))
  socket.on('connect_timeout', timeout => console.error(new Error({ message: 'timeout', timeout: timeout })))
  socket.on('error', error => console.error(error))
  socket.on('disconnect', () => postMessage({ type: 'disconnect' }))
  socket.on('reload', () => postMessage({ action: 'reload' }))
}

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

const getStatus = () => {
  if (ready) {
    commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
    commitRoot('setStates', { keys: ['socket', 'user', 'loading'], datas: [socket.id, rxUser.toJSON(), false] })
  } else {
    init()
      .then()
      .catch(e => console.error(e))
  }
}

const newOrder = (order, isMulti) => {
  return RxCollection.insert(order)
    .then(_doc => {
      console.log(_doc)
      if (!isMulti) {
        commit('setStates', { keys: ['newOrder', 'newOrderConverted'], datas: [null, null] })
        commitCloseDialog('Create')
      }
      return _doc
    })
    .catch(e => {
      console.error(e)
      if (e.message.includes('conflict')) commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${order._id} existed`, life: 10000 })
      else commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      if (!isMulti) commitCloseDialog('')
    })
}

const newOrders = orders => {
  const _newOrders = orders.map(o => repareNewOrder({ ...o }))
  return Promise.all(_newOrders.map(_newOrder => newOrder(_newOrder, true)))
    .then(_docs => {
      console.log('newOrders _docs: ', _docs)
      const _docOks = _docs.map(_doc => {
        if (_doc) return _doc._id
      })
      if (_docOks.length) commitCloseDialog(`${_docOks.join(', ')} created`)
      else commitCloseDialog(``)
    })
    .catch(e => console.error(e))
}

const dropOrders = ({ docs, note }) => {
  Promise.all(
    docs.map(order => {
      const edited = { ...order, ...{ dropped: Date.now() } }
      edited.logs.unshift({ type: 'Drop', _rev: edited._rev, at: Date.now(), by: rxUser._id, note: note })
      delete edited.ui
      return RxCollection.upsert(edited)
    }),
  )
    .then(() => {
      commit('setState', { key: 'selected', data: [] })
      commitCloseDialog('Delete')
    })
    .catch(e => console.error(e))
}

// const dropOrders = ({ docs, note }) => {
//   const result = { _ids: [], docs: [], indexs: [] }
//   Promise.all(
//     docs.map(order => {
//       const listIdx = list.findIndex(item => item._id === order._id)
//       const edited = { ...order, ...{ dropped: Date.now() } }
//       edited.logs.unshift({ type: 'Drop', _rev: edited._rev, at: Date.now(), by: rxUser._id, note: note })
//       list[listIdx] = edited
//       result._ids.push(edited._id)
//       result.docs.push(edited)
//       result.indexs.push(listIdx)
//       const cloneToUpsert = { ...edited }
//       delete cloneToUpsert.ui
//       return RxCollection.upsert(cloneToUpsert)
//     }),
//   )
//     .then(() => {
//       result._ids.map(_id => delete ui[_id])
//       updateUserState().then(() => {
//         result.docs.map((_doc, i) => commitRoot('setStateDeep', { dotPath: 'Order.Film.list', key: result.indexs[i], value: _doc }))
//         commitCloseDialog('Delete')
//       })
//     })
//     .catch(e => console.error(e))
// }

const commitCloseDialog = mess => {
  commitRoot('Dialog/setState', { key: 'loading', data: false })
  if (mess) commitRoot('Dialog/setMess', { text: `${mess} Success`, severity: 'success' })
  setTimeout(() => {
    commitRoot('Dialog/setMess', { text: '', severity: '' })
    commitRoot('Dialog/setState', { key: 'isOpen', data: false })
  }, 1000)
}

const subscribeInsert = changeEvent => {
  console.log('insert$: ', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx })
    } else if (!doc._rev.startsWith('1-')) {
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index })
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list })
  }
}

const subscribeUpdate = changeEvent => {
  console.log('update$: ', changeEvent)
  const _$doc = { ...changeEvent.data.v }
  let _needUpdateUserState = false
  if (ui[_$doc._id]) _$doc.ui = ui[_$doc._id]
  if (list.length) {
    const { doc, index } = queryBy_id(_$doc._id, list)
    if (!doc) {
      const _idx = pushSortBy_id(list, _$doc)
      commit('insertAt', { key: 'list', data: _$doc, idx: _idx })
    } else if (doc._rev !== _$doc._rev) {
      if (!_$doc.dropped) {
        const _checkKeys = ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames']
        if (!_$doc.ui) _$doc.ui = {}
        const _currentUi = ui[_$doc._id]
        _checkKeys.map(key => {
          if (doc[key] !== _$doc[key]) {
            const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
            _$doc.ui[key] = _change
            _currentUi[key] = _change
            _needUpdateUserState = true
          }
        })
      }
      if (_needUpdateUserState) updateUserState()
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index })
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list })
  }
}

const preInsert = docObj => {
  docObj.createdAt = Date.now()
  docObj.createdBy = rxUser._id
  docObj.logs.unshift({ type: 'Create', _rev: null, at: docObj.createdAt, by: rxUser._id, note: docObj.note })
  delete docObj.note
}

const allNewOrderCheck = ({ datas, indexs }) => datas.map((data, i) => newOrderCheck({ data, index: indexs[i] }))

const allDroppedOrderCheck = ({ datas, indexs }) => datas.map((data, i) => droppedOrderCheck({ data, index: indexs[i] }, true))

const newOrderCheck = ({ data, index }) => {
  data.icon = 'pi-check color-green'
  list[index] = data
  data.ui = {}
  ui[data._id] = {}
  updateUserState().then(() => {
    commit('replaceAt', { key: 'list', data, idx: index })
    delete data.icon
    setTimeout(() => commitRoot('setStateDeep', { dotPath: 'Order.Film.list', key: index, value: data }), 3000)
  })
}

const droppedOrderCheck = ({ data, index }, isMulti) => {
  list.splice(index, 1)
  delete ui[data._id]
  updateUserState().then(() => {
    if (isMulti) commit('splice', { key: 'list', _id: data._id })
    else commit('spliceAt', { key: 'list', idx: index })
  })
}

const changeCheck = ({ _id, key, index }) => {
  delete list[index].ui[key]
  delete ui[_id][key]
  updateUserState().then(() => commit('replaceAt', { key: 'list', data: list[index], idx: index }))
}

const updateUserState = () => {
  return rxUser.atomicUpdate(oldData => {
    oldData.state = user.state
    return oldData
  })
}

const func = { init, getStatus, newOrder, newOrders, dropOrders, allNewOrderCheck, newOrderCheck, droppedOrderCheck, allDroppedOrderCheck, changeCheck }
