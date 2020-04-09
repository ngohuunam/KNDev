import Vue from 'vue'
import { pushAtSortPosition } from 'array-push-at-sort-position'

export const setState = (state, { key, data }) => {
  state[key] = data
}

export const setStates = (state, { keys, datas }) => {
  keys.map((key, idx) => (state[key] = datas[idx]))
}

export const setStateDeep = (state, { dotPath, key, value }) => {
  const deepState = dotPath.split('.').reduce((o, i) => o[i], state)
  // console.log(deepState)
  Vue.set(deepState, key, value)
}

export const pushState = (state, payload) => {
  state[payload.state].push(payload.value)
}

export const push_sort = (state, { key, data, sortKey }) => {
  const _state = state[key]
  const _idx = _state.findIndex(v => v._id === data._id)
  if (_idx < 0) pushAtSortPosition(_state, data, (a, b) => (a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0), true)
  else if (_state[_idx]._rev !== data._rev) Vue.set(_state, _idx, data)
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
