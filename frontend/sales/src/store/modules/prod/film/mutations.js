import Vue from 'vue'

export const create = (state, newProd) => {
  const _newProd = { ...newProd }
  _newProd.name = _newProd.name.toProperCase()
  _newProd.endAt = _newProd.endAt ? _newProd.endAt.getTime() : 0
  state.converted = _newProd
}

export const unshift = (state, { key, data }) => {
  const _state = state[key]
  _state.unshift(data)
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

export const replace = (state, { key, data, field }) => {
  const _state = state[key]
  const idx = _state.findIndex(item => item[field] === data[field])
  Vue.set(_state, idx, data)
}

export const spliceMess = (state, idx) => {
  state.messages.splice(idx, 1)
}

export const Worker = () => {}
