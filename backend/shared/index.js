const { staffs, secret, dbOpt, dbLog, initDB, getDb, attachDB, couchUrl } = require('./database')
const { encrypt, decrypt } = require('./crypto')
const { sendCompressed, sendLogin } = require('./send-file')
const { streamRender, redirectToLogin, readReplaceRes, readReplaceMultiRes, doCompress, insertTokenRes, resetPage } = require('./stream')
const socket = require('./socket')
const { initLogger } = require('./logger')
const { nextErr, throwErr } = require('./error')
const { attachHeaderBearer, consoleLogReq, consoleLogRes, consoleLogReqRes } = require('./middle')

const atob = data => Buffer.from(data, 'base64').toString('ascii')
const btoa = string => Buffer.from(string).toString('base64')

module.exports = {
  atob,
  btoa,
  staffs,
  initDB,
  getDb,
  attachDB,
  encrypt,
  decrypt,
  sendCompressed,
  sendLogin,
  streamRender,
  redirectToLogin,
  readReplaceRes,
  readReplaceMultiRes,
  doCompress,
  insertTokenRes,
  resetPage,
  secret,
  dbOpt,
  dbLog,
  couchUrl,
  socket,
  initLogger,
  nextErr,
  throwErr,
  attachHeaderBearer,
  consoleLogReq,
  consoleLogRes,
  consoleLogReqRes,
}
