/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const orders_film = require('./orders/orders-film')
const passport = require('passport')
const { nano, dbName, attachDB } = require('../../shared/index')

// Film Orders
// -----------------
router.get(
  '/orders/film',
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  (req, res, next) => attachDB(req, res, next, dbName.orders.film),
  orders_film,
)

// router.get('/err', function(req, res, next) {
//   next(new Error('Some Error'))
// })

// // API Specific 404 / Error Handlers
// // ---------------------------------

// API not found
router.use(function(req, res, next) {
  res.status(404)
  res.send()
})

// erorrs handler
router.use(function(err, req, res, next) {
  const status = err.status || 500
  res.status(status)
  res.json({
    app: 'api',
    status: status,
    error: err.message,
  })
})

// Exports
// -------

module.exports = router
