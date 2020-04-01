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

app.use(morgan('combined', { stream: webLogger.stream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
// ------
app.use(express.static(join(__dirname, 'pages/public')))
app.use('/', routes)

// Exports
// -------

module.exports = app
