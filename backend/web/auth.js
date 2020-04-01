const passport = require('passport')
const jwt = require('jsonwebtoken')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { secret, staffs, redirectToLogin } = require('../shared/index')

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
        if (!validate) return done(new Error({ name: 401, message: 'Wrong Password' }))

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
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: secret.web,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      // console.log('web jwt token:', token)
      try {
        //Pass the user details to the next middleware
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
      return redirectToLogin(res, 401, `${err.message}, re-login`, `cmd:window.localStorage.removeItem('info')`)
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = { passport, handleAuthJwt }
