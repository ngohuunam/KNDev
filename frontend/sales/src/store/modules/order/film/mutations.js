import Vue from 'vue'
import { newOrder } from '@/tools'

export const create = (state, note) => {
  const _newOrder = { ...state.new, ...note }
  console.log('note', note)
  state.converted = newOrder.film(_newOrder)
}

export const spliceListBy_id = ({ list }, { _id }) => {
  const index = list.findIndex(item => item._id === _id)
  list.splice(index, 1)
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
