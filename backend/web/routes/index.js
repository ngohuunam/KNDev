const express = require('express')
const router = express.Router()
const home = require('./home')
const login = require('./login')
const userPage = require('./user-page')
const userPageAssets = require('./user-page-assets')

/* GET Login as home page. */
router.get('/', home)

/* POST login page. */
router.post('/', login)

/* GET home page. */
router.get('/:dept/:page/:token', userPage)

/* GET page's assets. */
router.get(['/:dept/:page/:token/:file', '/:dept/:page/:token/:folder/:file'], userPageAssets)

module.exports = router
