import { initDb, insertSubcribe, updateSubcribe } from '../shared'
import { newOrder as repareNewOrder, queryBy_id } from '../../../tools'
import { dbName, opts, preInsert } from './options'

const { console } = self
const RxCol = {}
const list = {}
const RxQuery = {}
let user_id
const colNames = []
const ports = []

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload, colName) => postMessage({ action: 'commit', type: `${dbName}/${colName}/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = (token, userId, queries) => {
  user_id = userId
  opts.forEach(opt => {
    const { colName, checkKeys } = opt
    opt.query = queries[colName]
    initDb(dbName, opt, token)
      .then(({ rxCol, sync }) => {
        const { query, sort } = opt
        colNames.push(colName)
        RxCol[colName] = rxCol
        RxQuery[colName] = RxCol[colName].find(query).sort(sort)
        RxQuery[colName].exec().then(rxDocs => {
          list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
          console.log('list', list)
          commit('setStates', { keys: ['list', 'loading'], datas: [list[colName], false] }, colName)
        })
        RxCol[colName].preInsert(docObj => preInsert(docObj, user_id), true)
        RxCol[colName].insert$.subscribe(changeEvent => insertSubcribe(changeEvent, list[colName], commit, colName))
        RxCol[colName].update$.subscribe(changeEvent => updateSubcribe(changeEvent, checkKeys, list[colName], commit, commitRoot, colName, dbName))
        sync.denied$.subscribe(docData => console.log('denied$: ', docData))
        sync.error$.subscribe(error => console.log('error$: ', error))
      })
      .catch(e => console.error(e))
  })
}

const create = (doc, colName) => {
  return RxCol[colName]
    .insert(doc)
    .then(() => {
      commit('setState', { key: 'new', data: null }, colName)
      commitCloseDialog('Create')
    })
    .catch(e => {
      console.error(e)
      if (e.message.includes('conflict')) commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${doc._id} existed`, life: 10000 })
      else commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
    })
}

const creates = (docs, colName) => {
  return Promise.all(
    docs.map(doc => {
      doc = repareNewOrder[colName](doc)
      return RxCol[colName].insert(doc).catch(e => {
        console.error(e)
        if (e.message.includes('conflict')) commitRoot('pushToasts', { severity: 'error', summary: 'CONFLICT', detail: `${doc._id} existed`, life: 10000 })
        else commitRoot('pushToasts', { severity: 'error', summary: 'ERROR', detail: `${e.message}`, life: 10000 })
      })
    }),
  )
    .then(_docs => {
      const _docOks = _docs.map(_doc => {
        if (_doc) return _doc._id
      })
      if (_docOks.length) commitCloseDialog(`${_docOks.join(', ')} created`)
      else commitCloseDialog(`Nothing created`)
    })
    .catch(e => console.error(e))
}

const drop = ({ docs, note }, colName) => {
  Promise.all(
    docs.map(doc => {
      doc.dropped = Date.now()
      doc.logs.unshift({ type: 'Drop', _rev: doc._rev, at: doc.dropped, by: user_id, note: note })
      return RxCol[colName].upsert(doc)
    }),
  )
    .then(() => {
      commit('setState', { key: 'selected', data: [] }, colName)
      commitCloseDialog('Delete')
    })
    .catch(e => console.error(e))
}

const newJob = (prod, colName) => {
  console.log(prod)
  const _query = queryBy_id(prod.orderId, list[colName])
  const _order = { ..._query.doc }
  _order.products.unshift(prod._id)
  _order.productNames = prod.name + (_order.productNames ? ', ' + _order.productNames : '')
  _order.logs.unshift({ type: 'Add prod', name: prod.name, _rev: _order._rev, at: Date.now(), by: user_id, note: prod.note })
  return RxCol[colName]
    .upsert(_order)
    .then(() => commitCloseDialog('Create'))
    .catch(e => console.error(e))
}

self.onconnect = e => {
  const port = e.ports[0]
  ports.push(port)

  port.onmessage = ({ data }) => {
    console.log('port.onmessage data: ', data)
    const { name, payload, colName } = data
    if (func[name]) func[name](payload, colName)
  }

  port.onmessageerror = e => {
    console.error('port.onmessageerror', e)
  }
}

const getStatus = ({ token, _id, _colNames, queries }) => {
  if (colNames.length) _colNames.forEach(_colName => commit('setStates', { keys: ['list', 'loading'], datas: [list[_colName] || [], false] }, _colName))
  else init(token, _id, queries)
}

const commitCloseDialog = mess => {
  commitRoot('dialog/setState', { key: 'loading', data: false })
  if (mess) commitRoot('dialog/setMess', { text: `${mess} Success`, severity: 'success' })
  setTimeout(() => {
    commitRoot('dialog/setMess', { text: '', severity: '' })
    commitRoot('dialog/setState', { key: 'isOpen', data: false })
  }, 1000)
}

const func = { getStatus, create, creates, drop, newJob }
