const ProdPlugin = store => {
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  const { log, error } = console
  const worker = new SharedWorker('./prod.shared-worker.js', { name: 'prod', type: 'module' })
  const colNames = ['film']
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id, colNames } })
  worker.port.onmessage = ({ data }) => {
    log('prod worker monmessage - data:', data)
    const { action, type, payload } = data
    switch (action) {
      case 'commit':
        commit(type, payload)
        break
    }
  }
  worker.port.onmessageerror = e => error('order worker.port onmessageerror:', e)
  worker.onerror = e => error('order worker onerror:', e)

  store.subscribe(async ({ type, payload }) => {
    if (type.includes('prod/') && type.includes('/Worker')) {
      const paths = type.split('/')
      payload.colName = paths[1]
      log('(prod plugin) mutation type:', type)
      log('(prod plugin) mutation payload:', payload)
      worker.port.postMessage(payload)
    }
    // if (type.startsWith('order/film/Worker')) {
    //   payload.colName = 'film'
    //   log('(order plugin) mutation type:', type)
    //   log('(order plugin) mutation payload:', payload)
    //   worker.port.postMessage(payload)
    // }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'prod' })
  log('store: ', store)
}

export default ProdPlugin
