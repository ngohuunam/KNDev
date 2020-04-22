import { Worker } from '../shared/worker'
import { dbName, opts, preInsert } from './options'

const { console } = self

console.log(self)

const ports = []
let postMess, worker
if (self.SharedWorkerGlobalScope) {
  postMess = function(msg) {
    ports.map(port => port.postMessage(msg))
  }
  self.onconnect = e => {
    const port = e.ports[0]
    ports.push(port)
    port.onmessage = e => onMess(e)
    port.onmessageerror = e => onMessError(e)
  }
} else {
  postMess = self.postMessage
  self.onmessage = e => onMess(e)
  self.onmessageerror = e => onMessError(e)
}

const commit = (type, payload, colName) => {
  postMess({ action: 'commit', type: `${dbName}/${colName}/${type}`, payload })
}

const commitRoot = (type, payload) => {
  postMess({ action: 'commit', type, payload })
}

const onMess = ({ data }) => {
  console.log('onmessage data: ', data)
  const { name, payload, colName } = data
  if (func[name]) func[name](payload, colName)
  else worker[name](payload, colName)
}
const onMessError = e => {
  console.error('onmessageerror', e)
}

class ProdWorker extends Worker {
  constructor(userId, token, dbName, opts, commit, commitRoot, preInsert) {
    super(userId, token, dbName, opts, commit, commitRoot, preInsert)
  }
  load({ orderIds }, colName) {
    const query = { orderId: { $in: orderIds } }
    console.log('(load) query', query)
    this.pullList(colName, query).then(() => this.commitList(colName))
  }
}

const init = (_id, token, queryParams) => {
  worker = new ProdWorker(_id, token, dbName, commit, commitRoot, preInsert)
  worker.init(opts, queryParams)
}

let countInterval = 0

const getStatus = ({ _id, token, colNames, queryParams }) => {
  if (!worker) init(_id, token, queryParams)
  else if (worker && worker.state === 'ready') colNames.forEach(colName => worker.begin(colName))
  else if (worker && worker.state === 'init') {
    if (countInterval < 11) {
      setTimeout(() => getStatus(), 2000)
      ++countInterval
    }
  } else if (worker && worker.state.includes('error')) console.error('worker error', worker.state)
}

const func = { getStatus }
