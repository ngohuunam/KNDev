// import io from 'socket.io-client'
// import { Store, get } from 'idb-keyval'
import initRxDB from './rxdb'
import schema from './schema/order-film'
import { pushSortBy_id, newOrder as repareNewOrder, queryBy_id, year, filter_rev } from '../../tools'

const { console } = self

// const user_store = new Store('kn', 'data')
let rxUser, film, ui, user
let list = []
const ports = []
let RxCollection, RxReplicationState
let ready = false
const checkKeys = ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames']

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload) => postMessage({ action: 'commit', type: `Order/Film/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = (token, user_id) => {
  console.log('token:', token)
  console.log('user_id:', user_id)
  return initRxDB('order', 'film', schema, token, user_id, 'order_film_2020').then(db => {
    db.col.database.waitForLeadership().then(() => console.log('isLeader now'))
    RxCollection = db.col
    RxReplicationState = db.replicationState
    rxUser = db.user
    user = rxUser.toJSON()
    film = user.state[year].order.film
    ui = film.ui
    // console.log('rxUser', rxUser)
    // console.log('ui: ', ui)
    list = db.json.reduce((acc, current) => {
      const _key = current._id
      if (ui[_key]) current.ui = ui[_key]
      if (current.dropped && !current.ui) return acc
      acc.push(current)
      return acc
    }, [])
    // console.log('RxCollection: ', RxCollection)
    // console.log('list: ', list)
    RxReplicationState.change$.subscribe(changeObj => {
      console.log('change$: ', changeObj)
      // commit('setSeq', changeObj.change.last_seq)
    })
    RxReplicationState.denied$.subscribe(docData => console.log('denied$: ', docData))
    RxReplicationState.error$.subscribe(error => console.error('error$: ', error))

    RxCollection.insert$.subscribe(subscribeInsert)
    RxCollection.update$.subscribe(changeEvent => subscribeUpdate(changeEvent, checkKeys))
    RxCollection.preInsert(preInsert, true)

    rxUser.collection.update$.subscribe(rxUserUpdateSubcribe)
    commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
    // commitRoot('setState', { key: 'loading', data: false })
    // initSocketIo(url)
    ready = true
  })
}

const rxUserUpdateSubcribe = changeEvent => {
  console.log('rxUser update$: ', changeEvent)
  if (changeEvent.data.db === 'remote') {
    const _newUser = { ...changeEvent.data.v }
    const _newFilm = _newUser.state[year].prod.film
    if (_newFilm._rev !== film._rev) {
      const _newUi = _newFilm.ui
      const _lastKey = _newFilm.last
      const _index = list.findIndex(_it => _it._id === _lastKey._id)
      switch (_lastKey.type) {
        case 'd':
          delete ui[_lastKey._id]
          list.splice(_index, 1)
          break
        case 'n':
          ui[_lastKey._id] = {}
          list[_index].ui = {}
          break
        case 'c':
          ui[_lastKey._id] = _newUi[_lastKey._id]
          list[_index].ui = _newUi[_lastKey._id]
          break
      }
      commit('setState', { key: 'list', data: list })
    }
  }
}

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
  if (ready) {
    commit('setStates', { keys: ['list', 'loading'], datas: [list, false] })
    // commitRoot('setState', { key: 'loading', data: false })
  } else {
    init(token, _id)
      .then()
      .catch(e => console.error(e))
  }
}

const newProd = prod => {
  console.log(prod)
  prod = preInsert(prod, true)
  const _order_id = prod.orderId
  const _query = queryBy_id(_order_id, list)
  const _order = { ..._query.doc }
  _order.products.unshift(prod._id)
  _order.productNames = _order.products.join(', ')
  _order.logs.unshift({ type: 'Add prod', _rev: _order._rev, at: prod.createdAt, by: user._id, note: prod.note })
  delete _order.ui
  return RxCollection.upsert(_order)
    .then(() => commitCloseDialog('Create'))
    .catch(e => console.error(e))
}

const newOrder = (order, isMulti) => {
  return RxCollection.insert(order)
    .then(_doc => {
      console.log(_doc)
      if (!isMulti) {
        commit('setStates', { keys: ['new', 'converted'], datas: [null, null] })
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

const subscribeUpdate = (changeEvent, _checkKeys) => {
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
        // if (!_$doc.ui) _$doc.ui = {}
        const _currentUi = ui[_$doc._id]
        _checkKeys.map(key => {
          if (doc[key] !== _$doc[key]) {
            const _change = { old: doc[key], new: _$doc[key], logs: filter_rev(_$doc.logs, doc._rev) }
            _$doc.ui[key] = _change
            _currentUi[key] = _change
            console.log('_$doc._id:', _$doc._id)
            console.log('key:', key)
            console.log('change:', _change)
            _needUpdateUserState = true
          }
        })
      }
      if (_needUpdateUserState) updateUserState({ type: 'c', _id: _$doc._id })
      list[index] = _$doc
      commit('replaceAt', { key: 'list', data: _$doc, idx: index })
    }
  } else {
    list.push(_$doc)
    commit('setState', { key: 'list', data: list })
  }
}

const preInsert = (docObj, needReturn) => {
  docObj.createdAt = Date.now()
  docObj.createdBy = user._id
  docObj.logs.unshift({ type: 'Create', _rev: null, at: docObj.createdAt, by: user._id, note: docObj.note })
  delete docObj.note
  if (needReturn) return docObj
}

const allNewOrderCheck = ({ datas, indexs }) => datas.map((data, i) => newOrderCheck({ data, index: indexs[i] }))

const allDroppedOrderCheck = ({ datas, indexs }) => datas.map((data, i) => droppedOrderCheck({ data, index: indexs[i] }, true))

const newOrderCheck = ({ data, index }) => {
  data.icon = 'pi-check color-green'
  list[index] = data
  data.ui = {}
  ui[data._id] = {}
  updateUserState({ type: 'n', _id: data._id }).then(() => {
    commit('replaceAt', { key: 'list', data, idx: index })
    delete data.icon
    setTimeout(() => commitRoot('setStateDeep', { dotPath: 'Order.Film.list', key: index, value: data }), 3000)
  })
}

const droppedOrderCheck = ({ data, index }, isMulti) => {
  list.splice(index, 1)
  delete ui[data._id]
  updateUserState({ type: 'd', _id: data._id }).then(() => {
    if (isMulti) commit('splice', { key: 'list', _id: data._id })
    else commit('spliceAt', { key: 'list', idx: index })
  })
}

const changeCheck = ({ _id, key, index }) => {
  delete list[index].ui[key]
  delete ui[_id][key]
  updateUserState({ type: 'c', _id: _id }).then(() => commit('replaceAt', { key: 'list', data: list[index], idx: index }))
}

const updateUserState = info => {
  film.last = info
  film.timestamp = Date.now()
  return rxUser.atomicUpdate(oldData => {
    film._rev = oldData._rev
    oldData.state = { ...user.state }
    return oldData
  })
}

const func = { init, getStatus, newOrder, newOrders, drop, allNewOrderCheck, newOrderCheck, droppedOrderCheck, allDroppedOrderCheck, changeCheck, newProd }
