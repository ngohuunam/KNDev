const passport = require('passport')
const { secret, staffs } = require('../shared/index')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
  'jwt-api',
  new JWTstrategy(
    {
      secretOrKey: secret.api,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await staffs.get(token.user)
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

const handleAuthJwt = (req, res, next, logger) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      logger.debug(err)
      return res.status(403).json(err.message)
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = { passport, handleAuthJwt }
