import Vue from 'vue'
import tools from '@/tools'

export const createNewProd = (state, payload) => {
  const _newProd = { ...state.newProd }
  _newProd._id = payload._id
  _newProd.orderId = payload.orderId
  _newProd.orderRev = payload.orderRev
  _newProd.name = _newProd.name.toProperCase()
  _newProd.createdBy = payload.user
  _newProd.endAt = _newProd.endAt ? _newProd.endAt.getTime() : null
  _newProd.status = 'Created'
  state.newProdConverted = _newProd
}

export const createNewOrder = (state, payload) => {
  const _newOrder = { ...state.newOrder }
  state.newOrderConverted = tools.newOrder(_newOrder, payload.user)
}

export const allNewOrderAccept = state => {
  state.changes = state.changes.filter(o => !o.new)
}

export const allChangedAccept = state => {
  state.changes = state.changes.filter(o => !o.update)
}

export const changedAccept = (state, payload) => {
  const _idx = state.list.findIndex(fo => fo._id === payload._id)
  const _oldOrder = state.list[_idx]
  const _newOrder = { ...{}, ..._oldOrder }
  _newOrder.keyHasChanged = _oldOrder.keyHasChanged.filter(k => k !== payload.key)
  _newOrder.hasChanged = _newOrder.keyHasChanged.length > 0
  Vue.set(state.list, _idx, _newOrder)
}

export const push = (state, payload) => {
  const _state = state[payload.state]
  const _data = payload.data
  const _idx = _state.findIndex(v => v._id === _data._id)
  if (_idx < 0) {
    _state.push(_data)
  } else if (_state[_idx]._rev !== _data._rev) Vue.set(_state, _idx, _data)
}

export const splice = (state, payload) => {
  const _state = state[payload.state]
  const _idx = _state.findIndex(v => v._id === payload._id)
  console.log('splice _idx: ', _idx)
  if (_idx > -1) _state.splice(_idx, 0)
}

export const filterOne = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => v._id !== payload._id)
}

export const filterSomeByIndexOf = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => v._id.indexOf(payload._id) < 0)
}

export const filterSome = (state, payload) => {
  state[payload.state] = state[payload.state].filter(v => !payload._ids.includes(v._id))
}

export const sort = (state, payload) => {
  const _state = state[payload.state]
  const _key = payload.key
  _state.sort((a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : 0))
}

export const push_sort = (state, payload) => {
  const _state = state[payload.state]
  const _data = payload.data
  const _idx = _state.findIndex(v => v._id === _data._id)
  if (_idx < 0) {
    _state.push(_data)
  } else if (_state[_idx]._rev !== _data._rev) Vue.set(_state, _idx, _data)
  const _key = payload.key
  _state.sort((a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : 0))
}

export const setState = (state, payload) => {
  state[payload.state] = payload.value
}

export const setStates = (state, payload) => {
  payload.states.map((st, idx) => (state[st] = payload.values[idx]))
}

export const pushMess = (state, value) => {
  state.messages.push(value)
}

export const setDeleted = (state, payload) => {
  payload.res.map(_r => {
    const _order = state.list.find(o => o._id === _r.id)
    _order.deleted = true
    _order._rev = _r.rev
  })
}

export const spliceMess = (state, idx) => {
  state.messages.splice(idx, 1)
}

export const setSeq = (state, seq) => {
  state.seq = seq
}

export const SOCKET_ORDER_FILMUPDATE = (state, { newDoc, newSeq }) => {
  console.log('SOCKET_ORDER_UPDATE', newDoc)
  const _docId = newDoc._id
  const _orderQuery = findBy_id(_docId, state.list)
  const _changeQuery = findBy_id(_docId, state.changes)
  const _change = _changeQuery.doc
  const _oldDoc = _orderQuery.doc
  if (_oldDoc) {
    if (_oldDoc._rev !== newDoc._rev) {
      const _checkKeys = ['team', 'endAt', 'finishAt', 'foreignTitle', 'vietnameseTitle', 'premiereDate', 'status', 'productNames']
      const _keysChanged = _checkKeys.map(key => _oldDoc[key] !== newDoc[key])
      if (_change) {
        const _allChangeKeys = _change.keys.concat(_keysChanged)
        _change.keys = [...new Set(_allChangeKeys)]
        // _keyHasChanged.map(k => {
        //   if (_change.keys.indexOf(k) < -1) _change.keys.push(k)
        // })
        // _change.keys.sort()
        Vue.set(state.changes, _changeQuery.index, _change)
      } else push_sort(state, { state: 'changes', data: { _id: _docId, keys: _keysChanged }, key: '_id' })
      Vue.set(state.list, _orderQuery.index, newDoc)
    }
  } else {
    const _changeTypeNew = { _id: _docId, keys: [], new: true }
    if (_change) Vue.set(state.changes, _changeQuery.index, _changeTypeNew)
    else push_sort(state, { state: 'changes', data: _changeTypeNew, key: '_id' })
    push_sort(state, { state: 'list', data: newDoc, key: '_id' })
  }
  state.seq = newSeq
}

export const SOCKET_ORDER_FILM_DELETE = (state, { newDoc, newSeq }) => {
  console.log('SOCKET_ORDER_DELETE', newDoc)
  const _id = newDoc._id
  filterOne(state, { state: 'list', _id: _id })
  filterOne(state, { state: 'selected', _id: _id })
  filterOne(state, { state: 'changes', _id: _id })
  state.seq = newSeq
  pushMess(state, { text: `${_id} deleted`, severity: 'warn' })
}

export const SOCKET_ORDER_FILM_NEW = (state, { newDoc, newSeq }) => {
  console.log('SOCKET_ORDER_NEW', newDoc)
  const _orderQuery = findBy_id(newDoc._id, state.list)
  if (_orderQuery.doc) Vue.set(state.list, _orderQuery.index, newDoc)
  else push_sort(state, { state: 'list', data: newDoc, key: '_id' })
  checkPushNewChange(state, newDoc._id)
  state.seq = newSeq
}

export const checkPushNewChange = (state, _id) => {
  const _new = { _id: _id, keys: [], new: true }
  const _query = findBy_id(_id, state.changes)
  if (_query.doc) Vue.set(state.changes, _query.index, _new)
  else push_sort(state, { state: 'changes', data: _new, key: '_id' })
}

const findBy_id = (id, source) => {
  let _idx
  const _doc = source.find(({ _id }, idx) => {
    _idx = idx
    return _id === id
  })
  return { index: _idx, doc: _doc }
}
