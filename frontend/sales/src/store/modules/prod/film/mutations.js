import Vue from 'vue'
import { queryBy_id, pushSortBy_id } from '@/tools'

export const create = (state, newProd) => {
  const _newProd = { ...newProd }
  _newProd.name = _newProd.name.toProperCase()
  _newProd.endAt = _newProd.endAt ? _newProd.endAt.getTime() : 0
  _newProd.status = 'Created'
  state.converted = _newProd
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

export const push = (state, { key, data }) => {
  const _state = state[key]
  const _data = data
  const _idx = _state.findIndex(v => v._id === _data._id)
  if (_idx < 0) _state.push(_data)
  else if (_state[_idx]._rev !== _data._rev) Vue.set(_state, _idx, _data)
}

export const sort = (state, payload) => {
  const _state = state[payload.state]
  const _key = payload.key
  _state.sort((a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : 0))
}

export const push_sort = (state, { key, data }) => {
  const _state = state[key]
  const _idx = _state.findIndex(v => v._id === data._id)
  if (_idx < 0) pushSortBy_id(_state, data)
  else if (_state[_idx]._rev !== data._rev) Vue.set(_state, _idx, data)
}

export const splice = (state, { key, _id }) => {
  const _state = state[key]
  const _idx = _state.findIndex(v => v._id === _id)
  if (_idx > -1) _state.splice(_idx, 1)
}

export const spliceAt = (state, { key, idx }) => {
  const _state = state[key]
  _state.splice(idx, 1)
}

export const replaceAt = (state, { key, data, idx }) => {
  const _state = state[key]
  Vue.set(_state, idx, data)
}

export const insertAt = (state, { key, data, idx }) => {
  const _state = state[key]
  _state.splice(idx, 0, data)
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

export const setState = (state, { key, data }) => {
  state[key] = data
}

export const setStates = (state, { keys, datas }) => {
  keys.map((key, idx) => (state[key] = datas[idx]))
}

export const pushMess = (state, value) => {
  state.messages.push(value)
}

export const replace = (state, { key, data }) => {
  const _state = state[key]
  const { index, doc } = queryBy_id(data._id, state[key])
  if (doc) Vue.set(_state, index, data)
  else pushSortBy_id(_state, data)
}

export const spliceMess = (state, idx) => {
  state.messages.splice(idx, 1)
}

export const setSeq = (state, seq) => {
  state.seq = seq
}

export const Worker = () => {}

export const dropOrdersOk = (state, { _ids }) => {
  _ids.sort()
  state.list.map(fo => {
    if (_ids.includes(fo._id)) fo.dropped = Date.now()
  })
}
