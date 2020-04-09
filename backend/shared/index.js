const { staffs, secret, dbOpt, dbLog, initDB, getDb, attachDB } = require('./database')
const { encrypt, decrypt } = require('./crypto')
const { sendGzip, sendLogin } = require('./send-file')
const { streamRender, redirectToLogin, readReplaceRes, readReplaceMultiRes, doGzip, insertTokenRes } = require('./stream')
const socket = require('./socket')
const { initLogger } = require('./logger')
const { nextErr, throwErr } = require('./error')
const attachHeaderBearer = require('./headers')

module.exports = {
  staffs,
  initDB,
  getDb,
  attachDB,
  encrypt,
  decrypt,
  sendGzip,
  sendLogin,
  streamRender,
  redirectToLogin,
  readReplaceRes,
  readReplaceMultiRes,
  doGzip,
  insertTokenRes,
  secret,
  dbOpt,
  dbLog,
  socket,
  initLogger,
  nextErr,
  throwErr,
  attachHeaderBearer,
}
