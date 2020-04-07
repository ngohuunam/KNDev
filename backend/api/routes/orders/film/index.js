const express = require('express')
const router = express.Router()

/* ----------------- GET REQUEST ----------------- */
/* ----------------------------------------------- */

// Film Orders Get All
// -----------------
const ordersFilmGetAll = require('./orders-film-get-all')
router.get('/', ordersFilmGetAll)

// Film Orders Get Sync
// -----------------
const ordersFilmGetSync = require('./orders-film-get-sync')
router.get('/sync/:seq', ordersFilmGetSync)

/* ------------------------------------------------ */
/* ------------------------------------------------ */

/* ------------------------------------------------ */
/* ----------------- POST REQUEST ----------------- */
/* ------------------------------------------------ */

// Film Orders Post One New Film order
// -----------------
const ordersFilmPostNew = require('./orders-film-post-new')
router.post('/', ordersFilmPostNew)

// Film Orders Post Some News Film order
// -----------------
const ordersFilmPostNews = require('./orders-film-post-news')
router.post('/some', ordersFilmPostNews)

/* -------------------------------------------------- */
/* -------------------------------------------------- */

/* -------------------------------------------------- */
/* ----------------- DELETE REQUEST ----------------- */
/* -------------------------------------------------- */

// Film Orders Delete
// -----------------
const ordersFilmDelete = require('./orders-film-delete')
router.delete('/', ordersFilmDelete)

// Export
// -----------------

module.exports = router
