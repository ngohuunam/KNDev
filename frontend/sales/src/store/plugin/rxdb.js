import { create as createRxDatabase, plugin as addRxDBPlugin } from 'rxdb/plugins/core'
// import RxDBNoValidateModule from 'rxdb/plugins/no-validate'
import RxDBLeaderElectionModule from 'rxdb/plugins/leader-election'
import RxDBReplicationModule from 'rxdb/plugins/replication'
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check'
import RxDBValidateModule from 'rxdb/plugins/validate'
import RxErrorsModule from 'rxdb/plugins/error-messages'
import JsonDumpPlugin from 'rxdb/plugins/json-dump'
import * as PouchdbAdapterHttp from 'pouchdb-adapter-http'
import PouchdbAdapterIndexeddb from 'pouchdb-adapter-indexeddb'
import PouchDB from 'pouchdb-core'
import { fetch } from 'pouchdb-fetch'

const init = (dbname, colName, schema, token, endpoint) => {
  loadRxDBPlugins()
  const result = { col: null, replicationState: null }
  return RxDatabase(dbname).then(db =>
    RxCollection(db, colName, schema).then(col => {
      return col.dump().then(json => {
        console.log('json: ', json)
        result.docs = json.docs
        result.col = col
        result.replicationState = RxReplicationState(col, token, endpoint)
        return result
      })
    }),
  )
}

// col.dump().then(json => console.dir(json))

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
  }).then(_db => {
    return _db.waitForLeadership().then(() => {
      console.log('isLeader now')
      return _db
    })
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

const RxReplicationState = (rxCol, token, endpoint, options = { live: true, retry: true }, direction = { pull: true, push: true }) => {
  return rxCol.sync({
    remote: rxRemote(token, endpoint),
    waitForLeadership: true,
    direction: direction,
    options: options,
    query: rxCol.find({ _deleted: { $exists: false } }),
  })
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
}

export default init
