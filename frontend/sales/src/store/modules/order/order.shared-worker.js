import { initDb, pullData, insertSubcribe, updateSubcribe, preInsert } from '../shared'
import { newOrder as repareNewOrder, queryBy_id } from '../../../tools'
import { dbName, opts, createQuery } from './options'

const { console } = self
const RxCol = {}
const list = {}
let user_id
const colNames = []
const ports = []
let token

const postMessage = msg => {
  const len = ports.length
  for (let i = 0; i < len; ++i) {
    ports[i].postMessage(msg)
  }
}

const commit = (type, payload, colName) => postMessage({ action: 'commit', type: `${dbName}/${colName}/${type}`, payload })

const commitRoot = (type, payload) => postMessage({ action: 'commit', type, payload })

const init = (_token, userId, userDbState) => {
  user_id = userId
  token = _token
  Object.values(opts).forEach(opt => {
    const { colName, checkKeys } = opt
    const query = createQuery[colName](userDbState[colName].ui)
    opt.query = query
    console.log(`${dbName} ${colName} init query`, opt.query)
    initDb(dbName, opt, token)
      .then(({ rxCol, sync }) => {
        const { sort } = opt
        colNames.push(colName)
        RxCol[colName] = rxCol
        RxCol[colName]
          .find(query)
          .sort(sort)
          .exec()
          .then(rxDocs => {
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
    .then(() => commitCloseDialog('Delete'))
    .catch(e => console.error(e))
}

const newProd = (prod, colName) => {
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

const getStatus = ({ token: _token, _id, _colNames, userDbState }) => {
  if (colNames.length) _colNames.forEach(_colName => commit('setStates', { keys: ['list', 'loading'], datas: [list[_colName] || [], false] }, _colName))
  else init(_token, _id, userDbState)
}

const commitCloseDialog = mess => {
  commitRoot('dialog/setState', { key: 'loading', data: false })
  if (mess) commitRoot('dialog/setMess', { text: `${mess} Success`, severity: 'success' })
  setTimeout(() => {
    commitRoot('dialog/setMess', { text: '', severity: '' })
    commitRoot('dialog/setState', { key: 'isOpen', data: false })
  }, 1000)
}

const reSync = ({ ui }, colName) => {
  const query = createQuery[colName](ui)
  console.log('(resync) query', query)
  pullData(RxCol[colName], opts[colName].endpoint, query, token)
    .then(() =>
      RxCol[colName]
        .find(query)
        .sort(opts[colName].sort)
        .exec()
        .then(rxDocs => {
          list[colName] = rxDocs.map(rxDoc => rxDoc.toJSON())
          console.log(`(resync) list ${colName}`, list[colName])
          commit('setState', { key: 'list', data: list[colName] }, colName)
        }),
    )
    .catch(e => console.error(e))
}

const func = { getStatus, create, creates, drop, newProd, reSync }
