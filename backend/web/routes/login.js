const express = require('express')
const router = express.Router()
const passport = require('passport')
const { nextErr, logger } = require('@shared')

router.post('/', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) nextErr(err, next)
    if (info) {
      logger.info('(POST /) info: ' + info)
      res.status(info.code).json(info.message)
    } else {
      req.login(user, { session: false }, error => {
        if (error) nextErr(error, next)
        logger.info('(POST /) user: ' + user)
        res.json(user)
      })
    }
  })(req, res, next)
})

module.exports = router
