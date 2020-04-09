const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { join } = require('path')
const { initLogger } = require('../shared')
const { handleAuthJwt } = require('./auth')
const proxy = require('express-http-proxy')

const webJwtAuthLogger = initLogger('auth/jwt/web')

const authJwt = (req, res, next) => handleAuthJwt(req, res, next, webJwtAuthLogger)

const webLogger = initLogger('web')

const routes = require('./routes')

// Web Express App
// ---------------

const app = express()

app.use(morgan('combined', { stream: webLogger.stream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
// ------
app.use(express.static(join(__dirname, 'pages/public')))

/* Proxy CouchDB. */
app.use('/db', authJwt, proxy('http://163.172.176.57:5984/'))

app.use('/', routes)

// Exports
// -------

module.exports = app
