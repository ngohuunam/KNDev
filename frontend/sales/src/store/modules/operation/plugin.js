import { objectDeep } from '../../../utils'

const OperationPlugin = store => {
  const {
    commit,
    state: {
      user: { token, _id },
    },
  } = store
  let worker
  if (window.SharedWorker) worker = new SharedWorker('./operation.kimnam-worker.js', { name: 'operation', type: 'module' })
  else worker = new Worker('./operation.kimnam-worker.js', { name: 'operation', type: 'module' })
  let myWorker = worker
  if (worker.port) {
    worker.port.start()
    myWorker = worker.port
  }
  const colNames = ['process']
  const queryParams = {}
  myWorker.postMessage({ name: 'getStatus', payload: { token, _id, colNames, queryParams } })
  myWorker.onmessage = ({ data }) => {
    console.log('operation worker onmessage - data:', data)
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
  myWorker.onmessageerror = e => console.error('operation myWorker onmessageerror:', e)
  worker.onerror = e => console.error('operation worker onerror:', e)

  store.subscribe(async ({ type, payload: mutationPayload }) => {
    if (type.includes('operation/')) {
      console.log('(operation plugin) mutation type:', type)
      console.log('(operation plugin) mutation payload:', mutationPayload)
      const paths = type.split('/')
      // const dbName = paths[0]
      const colName = paths[1]
      if (type.includes('/Worker')) myWorker.postMessage({ ...mutationPayload, ...{ colName } })
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: worker.port ? 'Shared - operation' : 'operation' })
}

export default OperationPlugin
