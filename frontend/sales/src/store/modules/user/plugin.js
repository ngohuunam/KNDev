import { objectDeep } from '../../../tools'
const UserPlugin = store => {
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  // const worker = new SharedWorker('./user.shared-worker.js', { name: 'user', type: 'module' })
  let worker
  if (window.SharedWorker) worker = new SharedWorker('./user.kimnam-worker.js', { name: 'user', type: 'module' })
  else worker = new Worker('./user.kimnam-worker.js', { name: 'user', type: 'module' })
  let myWorker = worker
  if (worker.port) {
    worker.port.start()
    myWorker = worker.port
  }
  myWorker.postMessage({ name: 'getStatus', payload: { token, _id } })
  myWorker.onmessage = ({ data }) => {
    console.log('user worker onmessage - data: ', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break
      case 'getState':
        payload.state = objectDeep(type, store.state)
        myWorker.postMessage(payload)
        break
    }
  }
  myWorker.onmessageerror = e => console.error('user myWorker onmessageerror', e)
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
      myWorker.postMessage(payload)
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'user' })
  if (worker) commit('pushState', { state: 'worker', value: worker.port ? 'Shared - user' : 'user' })
}

export default UserPlugin
