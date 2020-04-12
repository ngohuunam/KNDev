// import { Store, set, get } from 'idb-keyval'
// import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'
// import Default from '../../assets/defaultState'

const OrderFilmPlugin = async store => {
  // const idbstore = new Store('kn', 'data')
  const dbKey = 'order-film'
  const { commit } = store
  // const GET = get(dbKey, idbstore)
  // const SET = value => set(dbKey, value, idbstore)
  const { log, error } = console
  // const COMMIT = (TYPE, PAYLOAD) => {
  //   const _type = db.concat('/', col, '/', TYPE)
  //   store.commit(_type, PAYLOAD)
  // }
  // let seq
  // try {
  //   const _state = await GET
  //   log('_state', _state)
  //   if (_state) {
  //     seq = _state.seq
  //     commit('setStateDeep', { dotPath: 'Order', key: 'Film', value: _state })
  //   } else await SET({ ...Default.order.film.state })
  // } catch (err) {
  //   error(err)
  // }
  const worker = new SharedWorker('./order-film.shared-worker.js', { name: 'order-film', type: 'module' })
  // const worker_other = new SharedWorker('./order-other.shared-worker.js', { name: 'order-other', type: 'module' })
  // console.log('worker_other: ', worker_other)
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus' })
  worker.port.onmessage = ({ data }) => {
    log('worker monmessage - data: ', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break

      case 'reload':
        commit('SOCKET_RELOAD')
        break
    }
  }
  worker.port.onmessageerror = e => error('sw onmessageerror', e)
  worker.onerror = e => error('sw onerror', e)

  // let committing = false
  // store.subscribe(async ({ type, payload }, state) => {
  store.subscribe(async ({ type, payload }) => {
    // const _state = state.Order.Film
    log('mutation type: ', type)
    log('mutation payload: ', payload)
    // if (committing) return
    if (!type.includes('Order/Film/')) return
    if (type.includes('Worker')) worker.port.postMessage(payload)
    // else {
    //   try {
    //     await SET(_state)
    //   } catch (err) {
    //     error(err)
    //   }
    // }
  })
  if (worker) commit('pushState', { state: 'worker', value: dbKey })
  log('store: ', store)
}

export default OrderFilmPlugin

// const broadcast = new BroadcastChannel(dbKey, { type: 'idb', webWorkerSupport: true })
// const elector = createLeaderElection(broadcast, {
//   fallbackInterval: 2000, // optional configuration for how often will renegotiation for leader occur
//   responseTime: 1000, // optional configuration for how long will instances have to respond
// })
// elector.awaitLeadership().then(() => {
//   log('this tab is now leader')
//   dir(broadcast)
//   broadcast.onmessage = e => {
//     dir(e)
//   }
//   commit('pushState', { state: 'broadcast', value: broadcast.name })
// })
