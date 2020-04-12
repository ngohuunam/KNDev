const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { initLogger, couchUrl } = require('../shared')
const { handleAuthJwt } = require('./auth')
const proxy = require('express-http-proxy')
// const RxDBInit = require('./rxdb')

const dbJwtAuthLogger = initLogger('auth/jwt/db')

const authJwt = (req, res, next) => handleAuthJwt(req, res, next, dbJwtAuthLogger)

const dbLogger = initLogger('db')
// const logToConsole = (req, res, next) => consoleLogReqRes(req, res, next, 'web: /db')

// Web Express App
// ---------------

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/* Morgan. */
morgan.token('db', req => {
  const { path, method, query, body, user } = req
  const ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
  return `${ip} - ${user._id} - ${method} - ${path} - ${JSON.stringify(query)} - ${JSON.stringify(body)}`
})
const morganFormat = ':db :status :response-time ms :total-time ms'
app.use('/', authJwt)
app.use(morgan(morganFormat, { stream: dbLogger.stream }))
// app.use(logToConsole, proxy(couchUrl))
app.use(proxy(couchUrl))
// RxDBInit('order', 'film', couchUrl, 'orders_film_2020').then(rxdb => {
//   const rxSv = rxdb.server({ startServer: false })
//   const rxApp = rxSv.app
//   app.use(logToConsole, rxApp)
// })

// Exports
// -------

module.exports = app
