const passport = require('passport')
const { secret, staffs, nextErr, btoa } = require('../shared')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const basicAuth = 'Basic ' + btoa(process.env.COUCH_BASIC_AUTH)

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
    req.headers['authorization'] = basicAuth
    return next()
  })(req, res, next)
}

module.exports = { passport, handleAuthJwt }
