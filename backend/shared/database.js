const { couchdb, secret, dbOpt, dbLog } = require('./setting')
const nano = require('nano')(couchdb)
// console.log(nano)
const { encrypt } = require('./crypto')
const socket = require('./socket')
const { initLogger } = require('./logger')
const { throwErr } = require('./error')

const dbLogger = initLogger('shared/database')

const staffs = nano.use('staffs')

class Database {
  constructor() {
    this.db = null
    this.seq = null
    this.feed = null
    this.event = null
    this.name = null
  }
  async init({ endpoint, event }) {
    try {
      await nano.db.get(endpoint)
    } catch (err) {
      console.log('err.message', err.message)
      if (err.message.includes('exist'))
        try {
          await nano.db.create(endpoint)
        } catch (err) {
          console.error(err)
        }
    }
    this.name = endpoint
    this.db = nano.use(endpoint)
    this.event = event
    this.getSeq()
  }
  async getSeq() {
    try {
      const _dbinfo = await this.db.info()
      this.seq = encrypt(_dbinfo.update_seq)
    } catch (e) {
      throwErr(e, dbLogger)
    }
  }
  async bulk(ops, user, text) {
    dbLogger.info(`${user._id} - func: ${text} - db: ${this.name} - req: ${JSON.stringify(ops)}`)
    const res = await this.db.bulk(ops)
    dbLogger.info(`${user._id} - func: ${text} - db: ${this.name} - res: ${JSON.stringify(res)}`)
    await this.getSeq()
    return res
  }
  async news(ops, user) {
    return await this.bulk(ops, user, 'new docs')
  }
  async delete(ops, user) {
    return await this.bulk(ops, user, 'delete')
  }
  async new(doc, user) {
    dbLogger.info(`${user._id} - func: new doc - db: ${this.name} - req: ${JSON.stringify(doc)}`)
    const res = await this.db.insert(doc)
    dbLogger.info(`${user._id} - func: new doc - db: ${this.name} - res: ${JSON.stringify(doc)}`)
    socket.io
      .of('/sales/home')
      .to('order.film')
      .emit('create', JSON.stringify({ doc: res, seq: this.seq }))
    return res
  }
  async all(user) {
    dbLogger.info(`${user._id} get all db: ${this.name}`)
    const _body = await this.db.list({ include_docs: true })
    const _rows = _body.rows
    const _docs = _rows.map(row => row.doc)
    const res = _docs
    await this.getSeq()
    return res
  }
  async sync(seq, user) {
    dbLogger.info(`${user._id} sync db: ${this.name} -seq: ${seq}`)
    const changes = await this.db.changes({ include_docs: true, since: seq })
    const res = changes.results.map(r => r.doc)
    dbLogger.info(`${user._id} sync db: ${this.name} - res: ${JSON.stringify(res)}`)
    await this.getSeq()
    return res
  }
  isRunning(key) {
    if (key) return this[key] !== null
    return this.db !== null && this.seq !== null && this.eventNew !== null && this.eventDelete !== null && this.eventUpdate !== null
  }
}

const initDB = async opt => {
  try {
    const _db = new Database()
    await _db.init(opt)
    return _db
  } catch (err) {
    throwErr(err, dbLogger)
  }
}

const attachDB = (req, res, next, { db, col }) => {
  try {
    req.db = req.app.locals.dbs[db][col]
    return next()
  } catch (err) {
    next(err)
  }
}

const getDb = name => nano.use(name)

module.exports = {
  staffs,
  secret,
  dbOpt,
  dbLog,
  initDB,
  getDb,
  attachDB,
  couchUrl: couchdb.url,
}
