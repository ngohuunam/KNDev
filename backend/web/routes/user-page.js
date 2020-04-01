const express = require('express')
const router = express.Router()
const userPageGetHtml = require('./user-page-get-html')
const userPageGetAssets = require('./user-page-get-assets')

/* GET home page. */
router.get('/:dept/:page/:token', userPageGetHtml)

/* GET page's assets. */
router.get(['/:dept/:page/:token/:file', '/:dept/:page/:token/:folder/:file'], userPageGetAssets)

module.exports = router
