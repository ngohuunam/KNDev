const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { join } = require('path')
const { initLogger } = require('../shared')

const webLogger = initLogger('web')

const routes = require('./routes')

// Web Express App
// ---------------

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
/* Morgan. */
morgan.token('web', req => {
  const { path, method, query, body } = req
  const ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
  return `${ip} - ${method} - ${path} - ${JSON.stringify(query)} - ${JSON.stringify(body)}`
})
const morganFormat = ':web :status :response-time ms :total-time ms'
app.use(morgan(morganFormat, { stream: webLogger.stream }))

// Routes
// ------
app.use(express.static(join(__dirname, 'pages/public')))
app.use('/', routes)

// Exports
// -------

module.exports = app
