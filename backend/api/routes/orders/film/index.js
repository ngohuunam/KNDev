const express = require('express')
const router = express.Router()

// Film Orders Get All
// -----------------
const ordersFilmGetAll = require('./orders-film-get-all')
router.get('/', ordersFilmGetAll)

// Film Orders Post New Film order
// -----------------
const ordersFilmPostNew = require('./orders-film-post-new')
router.post('/', ordersFilmPostNew)

// Film Orders Delete
// -----------------
const ordersFilmDelete = require('./orders-film-delete')
router.delete('/', ordersFilmDelete)

// Film Orders Get Sync
// -----------------
const ordersFilmGetSync = require('./orders-film-get-sync')
router.get('/sync/:seq', ordersFilmGetSync)

// Export
// -----------------

module.exports = router
