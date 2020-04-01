const attachHeaderBearer = (req, res, next) => {
  // console.log('GET / param', req.params)
  req.headers.authorization = 'Bearer ' + req.params.token
  return next()
}

module.exports = attachHeaderBearer
