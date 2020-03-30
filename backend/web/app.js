const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { join } = require('path')
require('./auth')

const routes = require('./routes/index')

// Web Express App
// ---------------

const app = express()

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
