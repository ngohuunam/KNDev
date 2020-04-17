const passport = require('passport')
const { nextErr, initLogger } = require('../../shared/')

const signinLogger = initLogger('auth/signin')

const login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      signinLogger.error(err)
      if (err.message.indexOf('missing') > -1) return res.status(401).json('Email not found')
      return res.status(403).json(err.message)
    }
    if (info) {
      signinLogger.error(`Info: ${info.message}`)
      return res.status(401).json(info.message)
    }
    req.login(user, { session: false }, error => {
      if (error) nextErr(error, signinLogger, next)
      signinLogger.info(`Success user: ${JSON.stringify(user)}`)
      return res.status(200).json(user)
    })
  })(req, res, next)
}

module.exports = login
