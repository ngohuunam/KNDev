// import io from 'socket.io-client'
// import { Store, get } from 'idb-keyval'
// import initRxDB from './rxdb'
import schema from './schema/order-film.schema'
import { newOrder as repareNewOrder, queryBy_id, year } from '../../tools'
import { updateUserState, initDB, subscribeInsert, subscribeUpdate, preInsert, rxUserUpdateSubcribe } from './rx-subcribe-func'

const { console } = self

// const user_store = new Store('kn', 'data')
let film, ui, user, RxCollection, list, rxUser
const ports = []
let ready = false
const checkKeys = ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames']
const dbName = 'order'
const colName = 'film'
const endpoint = 'order_film_2020'

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload) => postMessage({ action: 'commit', type: `Order/Film/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = (token, user_id) =>
  initDB(dbName, colName, schema, token, user_id, endpoint, commit, checkKeys)
    .then(_res => {
      console.log('init _res: ', _res)
      ready = _res.ready
      user = _res.user
      film = user.state[year][dbName][colName]
      ui = film.ui
      list = _res.list
      RxCollection = _res.col
      rxUser = _res.rxUser
      _res.replicationState.denied$.subscribe(docData => console.log('denied$: ', docData))
      _res.replicationState.error$.subscribe(error => console.error('error$: ', error))

      RxCollection.insert$.subscribe(changeEvent => subscribeInsert(changeEvent, commit, list))
      RxCollection.update$.subscribe(changeEvent => subscribeUpdate(changeEvent, checkKeys, list, ui, commit, film, user, rxUser))
      RxCollection.preInsert(docObj => preInsert(docObj, user), true)

      rxUser.collection.update$.subscribe(changeEvent => rxUserUpdateSubcribe(changeEvent, year, dbName, film, list, ui, commit))
    })
    .catch(e => console.error(e))

// const initSocketIo = url => {
//   const cloneUser = { ...user }
//   delete cloneUser.password
//   socket = io(url)
//   socket.on('connect', () => commitRoot('setStates', { keys: ['socket', 'user', 'loading'], datas: [socket.id, cloneUser, false] }))
//   socket.on('connect_error', error => console.error(error))
//   socket.on('connect_timeout', timeout => console.error(new Error({ message: 'timeout', timeout: timeout })))
//   socket.on('error', error => console.error(error))
//   socket.on('disconnect', () => postMessage({ type: 'disconnect' }))
//   socket.on('reload', () => postMessage({ action: 'reload' }))
// }

self.onconnect = e => {
  const port = e.ports[0]
  ports.push(port)

  port.onmessage = ({ data }) => {
    console.log('port.onmessage data: ', data)
    const { name, payload } = data
    if (func[name]) func[name](payload)
  }

  port.onmessageerror = e => {
    console.error('sw port onmessageerror', e)
  }
}

const getStatus = ({ token, _id }) => {
  if (ready) commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
  else init(token, _id)
}

const newProd = prod => {
  console.log(prod)
  const _order_id = prod.orderId
  const _query = queryBy_id(_order_id, list)
  const _order = { ..._query.doc }
  _order.products.unshift(prod._id)
  _order.productNames = prod.name + (_order.productNames ? ', ' + _order.productNames : '')
  _order.logs.unshift({ type: 'Add prod', name: prod.name, _rev: _order._rev, at: Date.now(), by: user._id, note: prod.note })
  delete _order.ui
  return RxCollection.upsert(_order)
    .then(() => commitCloseDialog('Create'))
    .catch(e => console.error(e))
}

const newOrder = order => {
  return RxCollection.insert(order)
    .then(_doc => {
      console.log(_doc)
      commit('setStates', { keys: ['new', 'converted'], datas: [null, null] })
      commitCloseDialog('Create')
      return _doc
    })
    .catch(e => {
      console.error(e)
      if (e.message.includes('conflict')) commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${order._id} existed`, life: 10000 })
      else commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      commitCloseDialog('')
    })
}

const newOrders = orders => {
  return Promise.all(
    orders.map(_order => {
      _order = repareNewOrder(_order)
      return RxCollection.insert(_order).catch(e => {
        console.error(e)
        if (e.message.includes('conflict')) commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${_order._id} existed`, life: 10000 })
        else commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      })
    }),
  )
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

const drop = ({ docs, note }) => {
  Promise.all(
    docs.map(order => {
      const edited = { ...order, ...{ dropped: Date.now() } }
      edited.logs.unshift({ type: 'Drop', _rev: edited._rev, at: Date.now(), by: user._id, note: note })
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

const commitCloseDialog = mess => {
  commitRoot('Dialog/setState', { key: 'loading', data: false })
  if (mess) commitRoot('Dialog/setMess', { text: `${mess} Success`, severity: 'success' })
  setTimeout(() => {
    commitRoot('Dialog/setMess', { text: '', severity: '' })
    commitRoot('Dialog/setState', { key: 'isOpen', data: false })
  }, 1000)
}

const allNewCheck = ({ datas, indexs }) => datas.map((data, i) => newCheck({ data, index: indexs[i] }))

const allDroppedCheck = ({ datas, indexs }) => datas.map((data, i) => droppedCheck({ data, index: indexs[i] }, true))

const newCheck = ({ data, index }) => {
  data.icon = 'pi-check color-green'
  list[index] = data
  data.ui = {}
  ui[data._id] = {}
  updateUserState({ type: 'new', _id: data._id }, film, user, rxUser).then(() => {
    commit('replaceAt', { key: 'list', data, idx: index })
    delete data.icon
    setTimeout(() => commitRoot('setStateDeep', { dotPath: 'Order.Film.list', key: index, value: data }), 3000)
  })
}

const droppedCheck = ({ data, index }, isMulti) => {
  list.splice(index, 1)
  delete ui[data._id]
  updateUserState({ type: 'drop', _id: data._id }, film, user, rxUser).then(() => {
    if (isMulti) commit('splice', { key: 'list', _id: data._id })
    else commit('spliceAt', { key: 'list', idx: index })
  })
}

const changeCheck = ({ _id, key, index }) => {
  delete list[index].ui[key]
  delete ui[_id][key]
  updateUserState({ type: 'check', _id: _id, key: key }, film, user, rxUser).then(() => commit('replaceAt', { key: 'list', data: list[index], idx: index }))
}

const func = { init, getStatus, newOrder, newOrders, drop, allNewCheck, newCheck, droppedCheck, allDroppedCheck, changeCheck, newProd }
