// import Vue from 'vue'

export const setState = (state, payload) => {
  state[payload.state] = payload.value
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
