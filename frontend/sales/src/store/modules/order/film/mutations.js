import Vue from 'vue'
import { opts } from '../options'

export const create = (state, note) => {
  const _newOrder = { ...state.new, ...note }
  state.converted = opts.film.prepare(_newOrder)
}

export const spliceListBy_id = ({ list }, { _id }) => {
  const index = list.findIndex(item => item._id === _id)
  list.splice(index, 1)
}

export const spliceAt = (state, { key, idx }) => {
  const _state = state[key]
  _state.splice(idx, 1)
}

export const replace = (state, { key, data, field }) => {
  const _state = state[key]
  const idx = _state.findIndex(item => item[field] === data[field])
  Vue.set(_state, idx, data)
}

export const insertAt = (state, { key, data, idx }) => {
  const _state = state[key]
  _state.splice(idx, 0, data)
}

export const unshift = (state, { key, data }) => {
  const _state = state[key]
  _state.unshift(data)
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

export const spliceMess = (state, idx) => {
  state.messages.splice(idx, 1)
}

export const Worker = () => {}
