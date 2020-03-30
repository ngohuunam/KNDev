const { encrypt, decrypt } = require('./crypto')
const { sendGzip, sendLogin } = require('./send-file')
const { streamRender, redirectToLogin, readReplaceRes, doGzip } = require('./stream')
const { nano, db, uuids, secret, dbName, dbLog, Database, attachDB } = require('./database')
const socket = require('./socket')
const logger = require('./logger')
const { nextErr } = require('./error')

module.exports = {
  encrypt,
  decrypt,
  sendGzip,
  sendLogin,
  streamRender,
  redirectToLogin,
  readReplaceRes,
  doGzip,
  nano,
  db,
  uuids,
  secret,
  dbName,
  socket,
  logger,
  nextErr,
  dbLog,
  Database,
  attachDB,
}
