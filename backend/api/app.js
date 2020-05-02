const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { dbOpt, initDB, initLogger } = require('../shared')
const { handleAuthJwt } = require('./auth')

const apiLogger = initLogger('api')

const routes = require('./routes')

// API Express App
// ---------------

const app = express()

app.use(morgan('combined', { stream: apiLogger.stream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Database
// ------

if (!app.locals.dbs) app.locals.dbs = {}
try {
  Object.entries(dbOpt).forEach(([db, cols]) => Object.entries(cols).forEach(async ([col, opt]) => (app.locals.dbs[db] = { [col]: await initDB(opt) })))
} catch (err) {
  apiLogger.error(err)
}
// const dbOpts = [dbOpt.order.film]
// dbOpts.map(async opt => {
//   try {
//     app.locals.dbs[opt.name] = await initDB(opt)
//   } catch (err) {
//     apiLogger.error(err)
//   }
// })

// Routes
// ------

const apiJwtAuthLogger = initLogger('auth/jwt/api', 'debug', 'debug')

const authJwt = (req, res, next) => handleAuthJwt(req, res, next, apiJwtAuthLogger)

app.use('/', authJwt, routes)

// API Specific 404
// ------

app.use(function(req, res) {
  apiLogger.error(`404 - Api not found: ${req.originalUrl} - ${req.method} - ${req.ip}`)

  res.status(404)
  res.json('Api not found')
})

// Error Handlers
// ------

// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  const _status = err.statusCode || err.status || 500
  const _errInfo = `${_status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  apiLogger.error(_errInfo)
  // console.log('Api Error Info: ', err)
  // console.log('Api Error Info.info: ', err.info)

  res.status(_status)
  res.json(err.message)
})

// Exports
// -------

module.exports = app
