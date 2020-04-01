const express = require('express')
const router = express.Router()
const orders = require('./orders')

// Orders
// -----------------
router.use('/orders', orders)

// Error route
// -----------------
router.get('/err', function(req, res, next) {
  next(new Error('Some Error'))
})

// Exports
// -------

module.exports = router
