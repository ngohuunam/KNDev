const { couchdb, secret, dbOpt, dbLog } = require('./setting')
const nano = require('nano')(couchdb)
const { encrypt } = require('./crypto')
const socket = require('./socket')
const { initLogger } = require('./logger')

const dbLogger = initLogger('shared/database')

const staffs = nano.use('staffs')

class Database {
  constructor() {
    this.db = null
    this.seq = null
    this.feed = null
    this.eventNew = null
    this.eventUpdate = null
    this.eventDelete = null
    this.name = null
  }
  async getSeq() {
    try {
      const _dbinfo = await this.db.info()
      this.seq = encrypt(_dbinfo.update_seq)
    } catch (e) {
      dbLogger.error(e)
      throw new Error(e)
    }
  }
  async init(opt) {
    this.name = opt.name
    this.db = nano.use(opt.name)
    this.eventNew = opt.eventNew
    this.eventUpdate = opt.eventUpdate
    this.eventDelete = opt.eventDelete
    this.getSeq()
    this.feed = this.db.follow({ since: 'now', include_docs: true })
    this.feed.on('change', async change => {
      console.log(`feed ${this.name} change`, change)
      try {
        await this.getSeq()
      } catch (e) {
        dbLogger.error(e)
        throw new Error(e)
      }
      const _doc = change.doc
      let _skEvent = this.eventUpdate
      if (_doc._deleted === true) _skEvent = this.eventDelete
      else if (_doc._rev.startsWith('1-')) _skEvent = this.eventNew
      socket.sendNotification(_skEvent, { newDoc: _doc, newSeq: this.seq })
    })
    this.feed.follow()
  }
  async new(doc, user) {
    dbLogger.info(`${user._id} new doc db: ${this.name} - req: ${JSON.stringify(doc)}`)
    const res = await this.db.insert(doc)
    dbLogger.info(`${user._id} new doc db: ${this.name} - res: ${JSON.stringify(res)}`)
    return res
  }
  async delete(ops, user) {
    dbLogger.info(`${user._id} delete db: ${this.name} - req: ${JSON.stringify(ops)}`)
    const res = await this.db.bulk(ops)
    dbLogger.info(`${user._id} delete db: ${this.name} - res: ${JSON.stringify(res)}`)
    return res
  }
  async all(user) {
    dbLogger.info(`${user._id} get all db: ${this.name}`)
    const _body = await this.db.list({ include_docs: true })
    const _rows = _body.rows
    const _docs = _rows.map(row => row.doc)
    const res = _docs
    return res
  }
  async sync(seq, user) {
    dbLogger.info(`${user._id} sync db: ${this.name} -seq: ${seq}`)
    const changes = await this.db.changes({ include_docs: true, since: seq })
    console.log(`${user._id} sync db: ${this.name} -seq: ${seq} - changes: `, changes)
    await this.getSeq()
    const res = changes.results.map(r => r.doc)
    dbLogger.info(`${user._id} delete db: ${this.name} - res: ${JSON.stringify(res)}`)
    return res
  }
  isRunning(key) {
    if (key) return this[key] !== null
    return (
      this.db !== null &&
      this.seq !== null &&
      this.feed !== null &&
      this.eventNew !== null &&
      this.eventDelete !== null &&
      this.eventUpdate !== null
    )
  }
}

const initDB = async opt => {
  try {
    const _db = new Database()
    await _db.init(opt)
    return _db
  } catch (err) {
    dbLogger.error(err)
  }
}

const attachDB = (req, res, next, dotPath) => {
  try {
    const _name = dotPath.split('.').reduce((o, i) => o[i], dbOpt)
    req.db = req.app.locals.dbs[_name]
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
}
