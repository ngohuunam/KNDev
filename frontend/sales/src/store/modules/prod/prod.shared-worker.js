import { Worker } from '../shared/worker'
import { dbName, opts, createQuery, preInsert } from './options'

const { console } = self
const ports = []
let worker

class ProdWorker extends Worker {
  constructor(userId, token, dbName, opts, ports, preInsert) {
    super(userId, token, dbName, opts, ports, preInsert)
  }
  load({ _ids }, colName) {
    const query = { $and: [{ _id: { $in: _ids } }, { createdAt: { $gt: null } }] }
    console.log('(load) query', query)
    this.RxCol[colName]
      .find(query)
      .sort(this.opts[colName].sort)
      .exec()
      .then(rxDocs => {
        this.list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
        this.commitList(colName)
      })
  }
}

const init = (_id, token, queryParams) => {
  worker = new ProdWorker(_id, token, dbName, opts, ports, preInsert)
  const queries = {}
  for (const key in createQuery) {
    queries[key] = createQuery[key](queryParams[key])
  }
  worker.init(queries)
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
  else if (worker && worker.state === 'ready') colNames.forEach(colName => worker.begin(colName))
  else if (worker && worker.state === 'init') {
    if (countInterval < 11) {
      setTimeout(() => getStatus(), 2000)
      ++countInterval
    }
  } else if (worker && worker.state.includes('error')) console.error('worker error', worker.state)
}

const func = { getStatus }
