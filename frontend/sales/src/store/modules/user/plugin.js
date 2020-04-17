const UserPlugin = store => {
  console.log('store', store)
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  const { log, error } = console
  const worker = new SharedWorker('./user.shared-worker.js', { name: 'user', type: 'module' })
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id } })
  worker.port.onmessage = ({ data }) => {
    log('user worker onmessage - data: ', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break
    }
  }
  worker.port.onmessageerror = e => error('user worker onmessageerror', e)
  worker.onerror = e => error('user worker onerror', e)

  store.watch(
    ({ user }) => user,
    newVal => window.localStorage.setItem('user', JSON.stringify(newVal)),
    { deep: true },
  )

  store.subscribe(({ type, payload }) => {
    if (type.startsWith('user/Worker')) {
      log('user plugin mutation type: ', type)
      log('user plugin mutation payload: ', payload)
      worker.port.postMessage(payload)
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'user' })
}

export default UserPlugin
