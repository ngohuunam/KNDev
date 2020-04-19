import { objectDeep } from '../../../tools'
const UserPlugin = store => {
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  const worker = new SharedWorker('./user.shared-worker.js', { name: 'user', type: 'module' })
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id } })
  worker.port.onmessage = ({ data }) => {
    console.log('user worker onmessage - data: ', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break
      case 'getState':
        payload.state = objectDeep(type, store.state)
        worker.port.postMessage(payload)
        break
    }
  }
  worker.port.onmessageerror = e => console.error('user worker onmessageerror', e)
  worker.onerror = e => console.error('user worker onerror', e)

  store.watch(
    ({ user }) => user,
    newVal => window.localStorage.setItem('user', JSON.stringify(newVal)),
    { deep: true },
  )

  store.subscribe(({ type, payload }) => {
    if (type.startsWith('user/Worker')) {
      console.log('user plugin mutation type: ', type)
      console.log('user plugin mutation payload: ', payload)
      worker.port.postMessage(payload)
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'user' })
}

export default UserPlugin
