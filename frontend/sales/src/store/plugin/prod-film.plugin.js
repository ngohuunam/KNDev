const ProdFilmPlugin = store => {
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  const { log, error } = console
  const worker = new SharedWorker('./prod-film.shared-worker.js', { name: 'prod-film', type: 'module' })
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id } })
  worker.port.onmessage = ({ data }) => {
    log('prod-film worker monmessage - data: ', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break
    }
  }
  worker.port.onmessageerror = e => error('sw onmessageerror', e)
  worker.onerror = e => error('sw onerror', e)

  store.subscribe(async ({ type, payload }) => {
    switch (type) {
      case 'Prod/Film/Worker':
        log('mutation payload: ', payload)
        worker.port.postMessage(payload)
        break
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'order-film-prod' })
  log('store: ', store)
}

export default ProdFilmPlugin
