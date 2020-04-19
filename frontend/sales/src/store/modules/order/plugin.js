import { objectDeep, year } from '../../../tools'

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
  console.log('OrderPlugin userDbState', userDbState)
  const worker = new SharedWorker('./order.shared-worker.js', { name: 'order', type: 'module' })
  const colNames = ['film']
  const queryParams = { film: userDbState.film.ui }
  worker.port.start()
  worker.port.postMessage({ name: 'getStatus', payload: { token, _id, colNames, queryParams } })
  worker.port.onmessage = ({ data }) => {
    console.log('order worker monmessage - data:', data)
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

  store.subscribe(async ({ type, payload: mutationPayload }) => {
    console.log('(order plugin) mutation type:', type)
    console.log('(order plugin) mutation payload:', mutationPayload)
    if (type.includes('order/')) {
      const paths = type.split('/')
      // const dbName = paths[0]
      const colName = paths[1]
      if (type.includes('/Worker')) worker.port.postMessage({ ...mutationPayload, ...{ colName } })
      // else if (type.includes('List'))
      //   worker.port.postMessage({
      //     name: 'syncList',
      //     payload: { ...mutationPayload, ...{ list: state[dbName][colName].list, userDbState: state.user.state[year][dbName][colName].ui } },
      //   })
    }
  })
  if (worker) commit('pushState', { state: 'worker', value: 'order' })
}

export default OrderPlugin
