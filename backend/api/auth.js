const passport = require('passport')
const { secret, staffs, nextErr } = require('../shared')
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
  passport.authenticate('jwt-api', { session: false }, (err, user, info) => {
    if (err) nextErr(err, logger)
    if (info) {
      logger.error(info)
      return res.status(401).json(info.message)
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = { passport, handleAuthJwt }
