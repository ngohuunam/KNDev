const express = require('express')
const router = express.Router()
const passport = require('passport')
const { sendGzip } = require('../../shared/index')

/* GET user page's assets. */
router.get(
  ['/:dept/:page/:token/:file', '/:dept/:page/:token/:folder/:file'],
  (req, res, next) => {
    // console.log('GET / (assets) param', req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  async (req, res, next) => {
    // console.log('GET / (assets) next param', req.params)
    const _input = req.params.folder
      ? `web/pages/${req.params.dept}/${req.params.page}/${req.params.folder}/${req.params.file}`
      : `web/pages/${req.params.dept}/${req.params.page}/${req.params.file}`
    sendGzip(_input, req, res, next)
  },
)

module.exports = router
