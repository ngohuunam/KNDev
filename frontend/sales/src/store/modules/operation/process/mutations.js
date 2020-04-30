import { queryBy_key } from '../../../../utils'
import Vue from 'vue'

export const setState = (state, { key, data }) => {
  state[key] = data
}

export const setStates = (state, { keys, datas }) => {
  keys.map((key, idx) => (state[key] = datas[idx]))
}

export const unshift = (state, { key, data }) => {
  const _state = state[key]
  _state.unshift(data)
}

export const replace = (state, { key, prop, compare, data }) => {
  const _state = state[key]
  const { index, doc } = queryBy_key(prop, compare, _state)
  if (doc) Vue.set(_state, index, data)
}

export const replaceAt = (state, { key, index, data }) => {
  const _state = state[key]
  Vue.set(_state, index, data)
}

export const pushMess = (state, value) => {
  state.messages.push(value)
}

export const spliceMess = (state, idx) => {
  state.messages.splice(idx, 1)
}

export const Worker = () => {}
