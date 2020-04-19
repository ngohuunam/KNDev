import { objectDeep, year } from '../../../tools'
const ProdPlugin = store => {
  const {
    commit,
    state: {
      user: {
        token,
        _id,
        state: {
          [year]: { prod, order },
        },
      },
    },
  } = store
  const worker = new SharedWorker('./prod.shared-worker.js', { name: 'prod', type: 'module' })
  const queryParams = {}
  const colNames = ['film']
  queryParams.film = { prodUi: prod.film.ui, orderUi: order.film.ui }
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { _id, token, colNames, queryParams } })
  worker.port.onmessage = ({ data }) => {
    console.log('prod worker monmessage - data:', data)
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
  worker.port.onmessageerror = e => console.error('prod worker.port onmessageerror:', e)
  worker.onerror = e => console.error('prod worker onerror:', e)

  store.subscribe(async ({ type, payload: mutationPayload }) => {
    if (type.includes('prod/')) {
      console.log('(prod plugin) mutation type:', type)
      console.log('(prod plugin) mutation payload:', mutationPayload)
      const paths = type.split('/')
      const colName = paths[1]
      if (paths[2] === 'Worker') worker.port.postMessage({ ...mutationPayload, ...{ colName } })
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'prod' })
}

export default ProdPlugin
