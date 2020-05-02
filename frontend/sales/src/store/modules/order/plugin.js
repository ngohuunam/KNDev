import { objectDeep, year } from '../../../utils'

const OrderPlugin = store => {
  const {
    commit,
    state: {
      // order,
      user: {
        token,
        _id,
        state: {
          [year]: { order: userDbState },
        },
      },
    },
  } = store
  let worker
  if (window.SharedWorker) worker = new SharedWorker('./order.kimnam-worker.js', { name: 'order', type: 'module' })
  else worker = new Worker('./order.kimnam-worker.js', { name: 'order', type: 'module' })
  let myWorker = worker
  if (worker.port) {
    worker.port.start()
    myWorker = worker.port
  }
  const colNames = ['film']
  const selectorParams = { film: userDbState.film.ui }
  myWorker.postMessage({ name: 'getStatus', payload: { token, _id, colNames, selectorParams } })
  myWorker.onmessage = ({ data }) => {
    console.log('order worker onmessage - data:', data)
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
  myWorker.onmessageerror = e => console.error('order myWorker onmessageerror:', e)
  worker.onerror = e => console.error('order worker onerror:', e)

  store.subscribe(async ({ type, payload: mutationPayload }) => {
    if (type.includes('order/')) {
      console.log('(order plugin) mutation type:', type)
      console.log('(order plugin) mutation payload:', mutationPayload)
      const paths = type.split('/')
      // const dbName = paths[0]
      const colName = paths[1]
      if (type.includes('/Worker')) myWorker.postMessage({ ...mutationPayload, ...{ colName } })
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: worker.port ? 'Shared - order' : 'order' })
}

export default OrderPlugin
