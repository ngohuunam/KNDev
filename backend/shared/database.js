const { couchdb, secret, dbName } = require('./setting')
const nano = require('nano')(couchdb)
const { encrypt } = require('./crypto')
const socket = require('./socket')

class Database {
  constructor(name, _nano) {
    return (async () => {
      this.db = _nano.use(name)
      this.seq = this.getSeq()
      this.feed = this.db.follow({ since: 'now', include_docs: true })
      this.feed.on('change', async change => {
        console.log('orders change: ', change)
        this.seq = await this.getSeq()
        const _doc = change.doc
        let _skEvent = 'ORDER_UPDATE'
        if (_doc._deleted === true) _skEvent = 'ORDER_DELETE'
        else if (_doc._rev.startsWith('1-')) _skEvent = 'ORDER_NEW'
        socket.sendNotification(_skEvent, { newDoc: _doc, newSeq: this.seq })
      })
      this.feed.follow()
      return this // Return the newly-created instance
    }).call(this)
  }
  async getSeq() {
    const _dbinfo = await this.db.info()
    const _seq = encrypt(_dbinfo.update_seq)
    console.log('get dbSeq', _seq)
    return _seq
  }
}

const attachDB = async (req, res, next, dbName) => {
  const db = await new Database(dbName, nano)
  req.db = db
  next()
}

module.exports = {
  uuids: nano.uuids,
  db: nano.db,
  nano,
  secret,
  dbName,
  Database,
  attachDB,
}
