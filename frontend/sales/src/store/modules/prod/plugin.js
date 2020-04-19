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
  const colNames = ['film']
  // const filter = {}
  const query = { $and: [{ orderId: { $nin: [] } }, { _id: { $nin: [] } }, { createdAt: { $gt: null } }] }
  const queries = {}
  // colNames.map(colName => (filter[colName] = Object.keys(prod[colName].ui).filter(_id => prod[colName].ui[_id].dropped)))
  // console.log('ProdPlugin filter', filter)
  colNames.map(colName => {
    queries[colName] = { ...query }
    queries[colName].$and[0].orderId.$nin = Object.keys(order[colName].ui).filter(_id => order[colName].ui[_id].dropped)
    queries[colName].$and[1]._id.$nin = Object.keys(prod[colName].ui).filter(_id => prod[colName].ui[_id].dropped)
  })
  console.log('ProdPlugin queries', queries)
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id, colNames, queries } })
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
  worker.port.onmessageerror = e => console.error('order worker.port onmessageerror:', e)
  worker.onerror = e => console.error('order worker onerror:', e)

  store.subscribe(async ({ type, payload }) => {
    if (type.includes('prod/') && type.includes('/Worker')) {
      const paths = type.split('/')
      payload.colName = paths[1]
      console.log('(prod plugin) mutation type:', type)
      console.log('(prod plugin) mutation payload:', payload)
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
}

export default ProdPlugin
