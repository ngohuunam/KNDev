// import defaultState from '@/assets/defaultState'
// const defaultNewOrder = JSON.stringify(defaultState.newOrder)

const date = new Date()
export default {
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  standards: [],
  toasts: [],
  loading: false,
  worker: [],
  socket: null,
  broadcast: [],
}
