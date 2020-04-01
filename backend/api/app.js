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
const dbOpts = [dbOpt.orders.film]
dbOpts.map(async opt => {
  try {
    app.locals.dbs[opt.name] = null
    const _db = await initDB(opt)
    app.locals.dbs[opt.name] = _db
  } catch (err) {
    apiLogger.error(err)
  }
})

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

  apiLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

  res.status(err.status || 500)
  res.json(err.message)
})

// Exports
// -------

module.exports = app
