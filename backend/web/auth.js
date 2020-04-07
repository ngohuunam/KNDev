const passport = require('passport')
const jwt = require('jsonwebtoken')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { secret, staffs, redirectToLogin, nextErr } = require('../shared')

const isValidPassword = async (password, user) => {
  const compare = await bcrypt.compare(password, user.password)
  return compare
}

//Create a passport middleware to handle user registration
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        //Save the information provided by the user to the the database
        const hash = await bcrypt.hash(password, 10)
        const user = await staffs.insert({
          _id: email,
          password: hash,
          name: '',
          phone: '',
          email: email,
          department: '',
          dept: '',
          page: '',
          param: '',
          token: '',
        })
        //Send the user information to the next middleware
        return done(null, user)
      } catch (error) {
        console.error(error)
        return done(error)
      }
    },
  ),
)

//Create a passport middleware to handle User login
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        //Get user from database
        const user = await staffs.get(email)
        //Check Password
        const validate = await isValidPassword(password, user)
        if (!validate) return done(null, false, { message: 'Wrong Password' })

        //Sign the JWT token expire in 1 hour
        const token = jwt.sign({ user: user._id }, secret.web, { expiresIn: '30d', noTimestamp: true })
        //Assign token to user and populate
        user.token = token
        await staffs.insert(user)
        delete user.password
        //Populate to next middleware
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    },
  ),
)

const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(
  new JWTstrategy(
    {
      secretOrKey: secret.web,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      // console.log('web jwt token:', token)
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
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) nextErr(err, logger)
    if (info) {
      logger.error(info)
      return redirectToLogin(res, 401, `${info.message}, re-login`, `cmd:window.localStorage.removeItem('info')`)
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = { handleAuthJwt }
