const express = require('express')
const router = express.Router()
const passport = require('passport')
const { streamRender } = require('../../shared/index')

/* GET user page. */
router.get(
  '/:dept/:page/:token',
  (req, res, next) => {
    // console.log('GET / param', req.params)
    req.headers.authorization = 'Bearer ' + req.params.token
    next()
  },
  passport.authenticate('jwt', { session: false, failureRedirect: '/' }),
  async (req, res) => {
    // console.log('GET / next param', req.params)
    const token = req.params.token
    const _user = req.user
    streamRender(
      `/${_user.dept}/${_user.page}`,
      [
        { key: '{{title}}', value: _user._id },
        { key: `/${_user.dept}/${_user.page}`, value: `/${_user.dept}/${_user.page}/${token}` },
      ],
      res,
    )
  },
)

module.exports = router
