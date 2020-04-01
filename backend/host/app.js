const express = require('express')
require('express-async-errors')

// Root Express App
// ----------------

const app = express()

// Show routes called in console during development

// Sub-Apps
// --------
const api = require('@api')
const web = require('@web')
// const errors = require('@errors')

app.use('/api', api)
app.use('/', web)
// app.use(errors)

// Exports
// -------

module.exports = app
