const attachHeaderBearer = (req, res, next) => {
  // console.log('GET / param', req.params)
  req.headers.authorization = 'Bearer ' + req.params.token
  return next()
}

const consoleLogReq = (req, res, next, text, key) => {
  console.log(`(${text}) REQ: `, key ? req[key] : req)
  next()
}

const consoleLogRes = (req, res, next, text, key) => {
  console.log(`(${text}) RES: `, key ? res[key] : res)
  next()
}

const consoleLogReqRes = (req, res, next, text, key) => {
  console.log(`(${text}) REQ: `, key && key.req ? req[key.req] : req)
  console.log(`(${text}) RES: `, key && key.res ? res[key.res] : res)
  next()
}

module.exports = { attachHeaderBearer, consoleLogReq, consoleLogRes, consoleLogReqRes }
