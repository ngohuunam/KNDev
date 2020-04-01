const passport = require('passport')
const { nextErr, initLogger } = require('../../shared/')

const signupLogger = initLogger('auth/signup')

const signup = (req, res, next) => {
  passport.authenticate('signup', (err, user) => {
    if (err) {
      signupLogger.debug(err)
      if (err.message.indexOf('conflict') > -1) return res.status(401).json('Email existed')
      return res.status(403).json(err.message)
    }
    req.login(user, { session: false }, error => {
      if (error) nextErr(error, signupLogger, next)
      return res.status(200).json({ message: 'Signup successful', user: user })
    })
  })(req, res, next)
}

module.exports = signup
