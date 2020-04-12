import { create as createRxDatabase, plugin as addRxDBPlugin } from 'rxdb/plugins/core'
// import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBValidateModule from 'rxdb/plugins/validate'
import RxErrorsModule from 'rxdb/plugins/error-messages'
import JsonDumpPlugin from 'rxdb/plugins/json-dump'
// import UpdatePlugin from 'rxdb/plugins/update'
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http'
import PouchdbAdapterIndexeddb from 'pouchdb-adapter-indexeddb'
import PouchDB from 'pouchdb-core'
import { fetch } from 'pouchdb-fetch'
import userSchema from './schema/user.RxSchema'

const init = (dbname, colName, schema, token, userId, endpoint) => {
  loadRxDBPlugins()
  const result = { docs: [], json: [], col: null, replicationState: null, user: null }
  return RxDatabase(dbname).then(db =>
    Promise.all([RxCollection(db, colName, schema), RxCollection(db, 'user', userSchema)]).then(() => {
      return Promise.all([sync(db.collections[colName], token, endpoint), sync(db.collections['user'], token, 'staffs', { _id: { $eq: userId } })]).then(() => {
        result.col = db.collections[colName]
        result.replicationState = RxReplicate(result.col, token, endpoint)
        RxReplicate(db.collections['user'], token, 'staffs', { _id: { $eq: userId } })
        return Promise.all([
          result.col.dump().then(json => {
            result.json = json.docs
          }),
          db.collections['user']
            .findOne(userId)
            .exec()
            .then(_doc => (result.user = _doc)),
        ]).then(() => {
          return result
        })
      })
    }),
  )
}

const RxDatabase = dbname => {
  return createRxDatabase({
    name: dbname,
    adapter: 'indexeddb',
    multiInstance: true,
    queryChangeDetection: true,
    pouchSettings: {
      auto_compaction: true,
      adapter: 'indexeddb',
    },
  })
}

const RxCollection = (rxDb, colName, schema) => {
  return rxDb.collection({
    name: colName,
    schema: schema,
    methods: {},
    sync: true,
  })
}

const sync = (rxCol, token, endpoint, query) => {
  const _sub$ = { e: '', d: '', c: '' }
  const opt = {
    remote: rxRemote(token, endpoint),
    waitForLeadership: false,
    direction: { pull: true, push: false },
    options: { live: false, retry: true },
  }
  if (query) opt.query = rxCol.find(query)
  return new Promise((resolve, reject) => {
    const syncState = rxCol.sync(opt)
    _sub$.c = syncState.complete$.subscribe(completed => {
      // console.log(`sync ${endpoint} complete$: `, completed)
      if (completed) {
        rxCol.seq = completed.last_seq
        for (let key in _sub$) _sub$[key].unsubscribe()
        resolve(completed)
      }
    })
    _sub$.e = syncState.error$.subscribe(error => reject(error))
    _sub$.d = syncState.denied$.subscribe(docData => reject(docData))
  })
}

const RxReplicate = (rxCol, token, endpoint, query) => {
  const opt = {
    remote: rxRemote(token, endpoint),
    waitForLeadership: true,
    direction: { pull: true, push: true },
    options: { live: true, retry: true },
  }
  if (query) opt.query = rxCol.find(query)
  return rxCol.sync(opt)
}

const rxRemote = (token, endpoint) =>
  new PouchDB(`${self.location.origin}/db/${endpoint}`, {
    fetch: (url, opts) => {
      opts.headers.set('Authorization', 'Bearer ' + token)
      return fetch(url, opts)
    },
  })

const loadRxDBPlugins = () => {
  // addRxDBPlugin(RxDBNoValidateModule)
  addRxDBPlugin(RxDBLeaderElectionModule)
  addRxDBPlugin(RxDBReplicationModule)
  addRxDBPlugin(PouchdbAdapterHttp)
  addRxDBPlugin(PouchdbAdapterIndexeddb)
  addRxDBPlugin(RxDBSchemaCheckModule)
  addRxDBPlugin(RxDBValidateModule)
  addRxDBPlugin(RxErrorsModule)
  addRxDBPlugin(JsonDumpPlugin)
  // addRxDBPlugin(UpdatePlugin)
}

export default init
