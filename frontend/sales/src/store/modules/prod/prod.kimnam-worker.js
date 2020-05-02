import { Worker } from '../shared/worker'
import { dbName, opts } from './options'
import { isObjEmpty } from '../../../utils'

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
  constructor(userId, token, dbName, commit, commitRoot) {
    super(userId, token, dbName, commit, commitRoot)
  }
  // load({ _ids }, colName) {
  //   this.commit('setState', { key: 'loading', data: false }, colName)
  //   const queryObj = { _ids: { $in: _ids } }
  //   return this.query({ queryObj }, colName)
  // }
  query({ queryObj }, colName) {
    this.commit('setState', { key: 'loading', data: false }, colName)
    console.log('(query) queryObj', queryObj)
    console.log('(query) this.RxCol[colName]', this.RxCol[colName])
    if (queryObj && isObjEmpty(queryObj) === false) return this.pullList(colName, queryObj).then(() => this.commitList(colName))
  }
}

const init = (userId, token, selectorParams, lastQueries) => {
  worker = new ProdWorker(userId, token, dbName, commit, commitRoot)
  worker.init(opts, selectorParams).then(() => Object.entries(lastQueries).forEach(([colName, queryObj]) => worker.query({ queryObj }, colName)))
}

let countInterval = 0

const getStatus = ({ _id: userId, token, colNames, selectorParams, lastQueries }) => {
  if (!worker) init(userId, token, selectorParams, lastQueries)
  else if (worker && worker.state === 'ready') colNames.forEach(colName => worker.commitList(colName))
  else if (worker && worker.state === 'init') {
    if (countInterval < 11) {
      setTimeout(() => getStatus(), 2000)
      ++countInterval
    }
  } else if (worker && worker.state.includes('error')) console.error('worker error', worker.state)
}

const func = { getStatus }
