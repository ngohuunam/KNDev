const passport = require('passport')
const { nextErr, initLogger } = require('../../shared')

const signupLogger = initLogger('auth/signup')

const signup = (req, res, next) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      signupLogger.error(`Err: ${err.message}`)
      console.error(err)
      if (err.message.indexOf('conflict') > -1) return res.status(401).json('Email existed')
      return res.status(403).json(err.message)
    }
    if (info) {
      signupLogger.error(`Info: ${info.message}`)
      return res.status(401).json(info.message)
    }
    req.login(user, { session: false }, error => {
      if (error) nextErr(error, signupLogger, next)
      signupLogger.info(`Success user: ${JSON.stringify(user)}`)
      return res.status(200).json({ message: 'Signup successful', user: user })
    })
  })(req, res, next)
}

module.exports = signup
