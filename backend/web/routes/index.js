const express = require('express')
const router = express.Router()
const { attachHeaderBearer, sendLogin, initLogger } = require('../../shared')
const { handleAuthJwt } = require('../auth')

const webJwtAuthLogger = initLogger('auth/jwt/web')

const authJwt = (req, res, next) => handleAuthJwt(req, res, next, webJwtAuthLogger)

/* GET Login as home page. */
router.get('/', sendLogin)

/* POST login info page. */
router.post('/', require('./login'))

/* POST sign up. */
router.post('/signup', require('./signup'))

/* GET user page. */
router.get(['/:dept/:page/:token', '/:dept/:page/:token/:file', '/:dept/:page/:token/:folder/:file'], attachHeaderBearer, authJwt, require('./user-page'))

/* Proxy CouchDB. */
// router.use('/db', authJwt, require('./couchdb'))

module.exports = router
