const RxDB = require('rxdb')
const RxDBServerPlugin = require('rxdb/plugins/server')
const RxDBReplicationModule = require('rxdb/plugins/replication')
const MemoryAdapter = require('pouchdb-adapter-memory')
const PouchdbAdapterHttp = require('pouchdb-adapter-http')
const schema = require('./schema/order-film.RxSchema')
RxDB.plugin(RxDBServerPlugin)
RxDB.plugin(MemoryAdapter)
RxDB.plugin(PouchdbAdapterHttp)
RxDB.plugin(RxDBReplicationModule)

const init = async (dbname, colName, couchUrl, endpoint) => {
  const db = await RxDB.create({
    name: dbname,
    adapter: 'memory',
  })
  const col = await db.collection({
    name: colName,
    schema: schema,
    methods: {},
    sync: true,
  })
  RxReplicate(col, couchUrl + '/' + endpoint)
  return db
}

const RxReplicate = (rxCol, url, query) => {
  const opt = {
    remote: url,
    direction: { pull: true, push: true },
    options: { live: true, retry: true },
  }
  if (query) opt.query = rxCol.find(query)
  return rxCol.sync(opt)
}

module.exports = init
