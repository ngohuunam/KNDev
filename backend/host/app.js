const express = require('express')
const morgan = require('morgan')
const { BAD_REQUEST } = require('http-status-codes')
const { logger } = require('@shared')
require('express-async-errors')

// Root Express App
// ----------------

const app = express()

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Sub-Apps
// --------
const api = require('../api/app')
const web = require('@web')
// const errors = require('@errors')

app.use('/api', api)
app.use('/', web)
// app.use(errors)

// Print errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.message, err)
  return res.status(BAD_REQUEST).json({
    error: err.message,
  })
})

// Exports
// -------

module.exports = app
