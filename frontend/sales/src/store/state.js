// import defaultState from '@/assets/defaultState'
// const defaultNewOrder = JSON.stringify(defaultState.newOrder)

const date = new Date()
const user = window.localStorage.getItem('user')
export default {
  user: JSON.parse(user),
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  toasts: [],
  loading: false,
  worker: [],
  socket: null,
  broadcast: [],
}
