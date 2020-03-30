const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('./auth')

const routes = require('./routes/index')

// API Express App
// ---------------

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
// ------

app.use('/', routes)

// Exports
// -------

module.exports = app
