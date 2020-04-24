import Vue from 'vue'
import { objectDeep } from '../tools'

export const persitState = (state, { key }) => {
  window.localStorage.setItem(key, JSON.stringify(state[key]))
}

export const setState = (state, { key, data }) => {
  state[key] = data
}

export const setStates = (state, { keys, datas }) => {
  keys.map((key, idx) => (state[key] = datas[idx]))
}

export const mergeStateDeep = (state, { dotPath, key, value }) => {
  const deepState = objectDeep(dotPath, state)
  const clone = { ...deepState[key], ...value }
  Vue.set(deepState, key, clone)
}

export const setStateDeep = (state, { dotPath, key, value }) => {
  const deepState = objectDeep(dotPath, state)
  // console.log('setStateDeep deepState', deepState)
  Vue.set(deepState, key, value)
}

export const checkAndSetStateDeepNested = (state, { dotPath, keyCheck, field, key, value }) => {
  const deepState = objectDeep(dotPath, state)
  const clone = { ...deepState[key] }
  if (!clone[keyCheck] || typeof clone[keyCheck] !== 'object') clone[keyCheck] = {}
  clone[keyCheck][field] = value
  Vue.set(deepState, key, clone)
}

export const checkAndSetStateDeep = (state, { dotPath, keyCheck, key, value }) => {
  let deepState = objectDeep(dotPath, state)
  // console.log('setStateDeep deepState', deepState)
  if (!deepState[keyCheck] || typeof deepState[keyCheck] !== 'object') deepState[keyCheck] = {}
  Vue.set(deepState[keyCheck], key, value)
}

export const load = (state, { from, dotPath, key, prop }) => {
  const deepStateFrom = objectDeep(from, state)
  const _filter = deepStateFrom.map(item => item[prop])
  let deepStateTo = objectDeep(dotPath, state)
  Vue.set(deepStateTo, key, _filter)
  console.log(deepStateTo)
}

export const pushState = (state, payload) => {
  state[payload.state].push(payload.value)
}

export const pushToasts = (state, toast) => {
  state.toasts.push(toast)
}

export const clearToasts = state => {
  state.toasts = []
}

export const filterToasts = (state, detail) => {
  state.toasts = state.toasts.filter(t => t.detail !== detail)
}

export const SOCKET_RELOAD = () => {
  console.log('RELOAD')
  location.reload(true)
}

export const SOCKET_SETSTATE = (state, payload) => {
  console.log('SOCKET_SETSTATE', payload)
  setState(state, payload)
}

export const delLocalInfo = async () => {
  const infos = await window.indexedDB.databases()
  console.log('infos: ', infos)
  return Promise.all(
    infos.map(
      info =>
        new Promise((resolve, reject) => {
          const _DBRequest = window.indexedDB.deleteDatabase(info.name)
          _DBRequest.onerror = e => reject(e)
          _DBRequest.onsuccess = r => resolve(r)
        }),
    ),
  )
}
