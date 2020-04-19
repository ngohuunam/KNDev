import { Worker } from '../shared/worker'
import { dbName, opts, createQuery } from './options'

const { console } = self
const ports = []
let worker

class OrderWorker extends Worker {
  constructor(userId, token, dbName, opts, ports) {
    super(userId, token, dbName, opts, ports)
  }
  newProd(prod, colName) {
    console.log(prod)
    this.RxCol[colName]
      .findOne(prod.orderId)
      .exec()
      .then(rxDoc =>
        rxDoc
          .atomicUpdate(oldData => {
            oldData.products.unshift(prod._id)
            oldData.productNames = prod.name + (oldData.productNames ? ', ' + oldData.productNames : '')
            oldData.logs.unshift({ type: 'Add prod', name: prod.name, _rev: oldData._rev, at: Date.now(), by: this.userId, note: prod.note })
            return oldData
          })
          .then(() => this.commitCloseDialog('Create'))
          .catch(e => console.error(e)),
      )
  }
  reSync({ ui }, colName) {
    const query = createQuery[colName](ui)
    console.log('(resync) query', query)
    this.sync(query, colName)
  }
}

const init = (_id, token, queryParams) => {
  worker = new OrderWorker(_id, token, dbName, opts, ports)
  const queries = {}
  for (const key in createQuery) {
    queries[key] = createQuery[key](queryParams[key])
  }
  worker.init(queries).then(() => worker.commitListAll())
}

self.onconnect = e => {
  const port = e.ports[0]
  ports.push(port)

  port.onmessage = ({ data }) => {
    console.log('port.onmessage data: ', data)
    const { name, payload, colName } = data
    if (func[name]) func[name](payload, colName)
    else worker[name](payload, colName)
  }

  port.onmessageerror = e => {
    console.error('port.onmessageerror', e)
  }
}

let countInterval = 0

const getStatus = ({ _id, token, colNames, queryParams }) => {
  if (!worker) init(_id, token, queryParams)
  else if (worker && worker.state === 'ready') colNames.forEach(colName => worker.commitList(colName))
  else if (worker && worker.state === 'init') {
    if (countInterval < 11) {
      setTimeout(() => getStatus(), 2000)
      ++countInterval
    }
  } else if (worker && worker.state.includes('error')) console.error('worker error', worker.state)
}

const func = { getStatus }
