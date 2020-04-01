const express = require('express')
const router = express.Router()
const login = require('./login')
const signup = require('./signup')
const userPage = require('./user-page')
const { attachHeaderBearer, sendLogin, initLogger } = require('../../shared')
const { handleAuthJwt } = require('../auth')

const webJwtAuthLogger = initLogger('auth/jwt/web')

const authJwt = (req, res, next) => handleAuthJwt(req, res, next, webJwtAuthLogger)

/* GET Login as home page. */
router.get('/', sendLogin)

/* POST login info page. */
router.post('/', login)

/* POST sign up. */
router.post('/signup', signup)

/* GET user page. */
router.get(['/:dept/:page/:token', '/:dept/:page/:token/:file', '/:dept/:page/:token/:folder/:file'], attachHeaderBearer, authJwt, userPage)

module.exports = router
