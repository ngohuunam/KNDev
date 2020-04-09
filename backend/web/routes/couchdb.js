const express = require('express')
const router = express.Router()
const proxy = require('express-http-proxy')

/* Proxy CouchDB. */
router.use('/', proxy('http://163.172.176.57:5984/'))

module.exports = router
