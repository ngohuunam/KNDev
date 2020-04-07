import { Store, set, get } from 'idb-keyval'
import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'

const idbstore = new Store('order', 'film')

const OrderFilmPlugin = async store => {
  let savedState = await get('state', idbstore)
  if (!savedState) {
    setTimeout(() => store.commit('setState', { des: 'firstTime', value: false }), 20 * 1000)
    await set('state', store.state, idbstore)
  } else {
    savedState.worker = false
    savedState.socket = false
    savedState.broadcastChannel = false
    savedState.messageChannel = false
    store.replaceState(savedState)
  }
  const broadcast = new BroadcastChannel('order.film', { type: 'idb', webWorkerSupport: true })
  const elector = createLeaderElection(broadcast)
  await elector.awaitLeadership()

  let committing = false
  let worker

  store.subscribe(async (mutation, state) => {
    if (committing) return
    await set('state', state, idbstore)
    if (broadcast) broadcast.postMessage(mutation)
    // if (worker) {
    //   worker.postMessage(mutation)
    // }
  })

  if (broadcast) {
    // store.commit('setState', { des: 'broadcastChannel', value: true })
    console.log('init BroadcastChannel ' + broadcast)
    // broadcast.onmessage = e => {
    //   const data = e.data
    //   const type = data.type
    //   const payload = data.payload
    //   committing = true
    //   store.commit(type, payload)
    //   committing = false
    // }
  }

  const WW = require('worker-loader!./order-film.worker.js')
  worker = new WW()
  if (worker) {
    worker.postMessage({ name: 'connect', payload: window.location.origin })
    // channel = new MessageChannel() || null
    // if (channel) {
    //   worker.postMessage({ type: 'channel', port: channel.port2 }, [channel.port2])
    // }

    worker.onmessage = e => {
      console.log(e)
    }
    worker.onerror = e => {
      console.error('worker error ' + e.message)
      store.commit('setState', { des: 'worker', value: false })
    }

    document.addEventListener('visibilitychange', () => worker.postMessage({ type: 'closedByMe', value: document.hidden }), false)
  }
  console.dir(store)
}

export default OrderFilmPlugin
