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
  // const worker = new SharedWorker('./prod.shared-worker.js', { name: 'prod', type: 'module' })
  let worker
  if (window.SharedWorker) worker = new SharedWorker('./prod.kimnam-worker.js', { name: 'prod', type: 'module' })
  else worker = new Worker('./prod.kimnam-worker.js', { name: 'prod', type: 'module' })
  let myWorker = worker
  if (worker.port) {
    worker.port.start()
    myWorker = worker.port
  }
  const queryParams = {}
  const colNames = ['film']
  queryParams.film = { prodUi: prod.film.ui, orderUi: order.film.ui }
  myWorker.postMessage({ name: 'getStatus', payload: { _id, token, colNames, queryParams } })
  myWorker.onmessage = ({ data }) => {
    console.log('prod worker onmessage - data:', data)
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
  myWorker.onmessageerror = e => console.error('prod myWorker onmessageerror:', e)
  worker.onerror = e => console.error('prod worker onerror:', e)

  store.subscribe(async ({ type, payload: mutationPayload }) => {
    if (type.includes('prod/')) {
      console.log('(prod plugin) mutation type:', type)
      console.log('(prod plugin) mutation payload:', mutationPayload)
      const paths = type.split('/')
      const colName = paths[1]
      if (paths[2] === 'Worker') myWorker.postMessage({ ...mutationPayload, ...{ colName } })
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: worker.port ? 'Shared - prod' : 'prod' })
}

export default ProdPlugin
