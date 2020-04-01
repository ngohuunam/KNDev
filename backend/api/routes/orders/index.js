const express = require('express')
const router = express.Router()
const ordersFilm = require('./film')
const { attachDB } = require('../../../shared')

const attachDBFilmOrders = (req, res, next) => attachDB(req, res, next, 'orders.film.name')

// Orders Film
// -----------------
router.use('/film', attachDBFilmOrders, ordersFilm)

module.exports = router
