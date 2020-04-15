const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { initLogger } = require('../shared')
const { handleAuthJwt } = require('./auth')
const proxy = require('express-http-proxy')

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
// const basicAuth = 'Basic ' + btoa(process.env.COUCH_BASIC_AUTH)
app.use('/', authJwt)
app.use(morgan(morganFormat, { stream: dbLogger.stream }))
// app.use(logToConsole, proxy(couchUrl))
app.use(
  proxy(process.env.COUCHDB_URL, {
    // proxyReqPathResolver: function(req) {
    //   return '/couchdb'.concat(req.path)
    // },
    // proxyReqOptDecorator: proxyReqOpts => {
    //   // you can update headers
    //   proxyReqOpts.headers['authorization'] = basicAuth
    //   // console.log(proxyReqOpts)
    //   return proxyReqOpts
    // },
    https: true,
  }),
)

// Exports
// -------

module.exports = app
