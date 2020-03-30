const passport = require('passport')
const jwt = require('jsonwebtoken')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { secret, nano, logger } = require('../shared/index')
const staffs = nano.use('staffs')
// const { encrypt } = require('./crypto')

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
        const user = await staffs.insert({ _id: email, password: hash, email: email })
        //Send the user information to the next middleware
        return done(null, user)
      } catch (error) {
        if (error.message.indexOf('conflict.')) return done(null, false, { message: 'User Existed' })
        console.error(error)
        return done(null, false, { message: error.message })
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
        if (!validate) return done(null, false, { code: 401, message: 'Wrong Password' })

        //Sign the JWT token expire in 1 hour
        const token = jwt.sign({ user: user._id }, secret, { expiresIn: '1h', noTimestamp: true })
        //Assign token to user and populate
        user.token = token
        await staffs.insert(user)
        delete user.password
        //Populate to next middleware
        return done(null, user)
      } catch (error) {
        //User not exist
        if (error.message === 'missing') return done(null, false, { code: 401, message: 'User not found' })
        logger.error(error)
        return done(null, false, { code: 403, message: error.message })
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
      secretOrKey: secret,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      // console.log('jwt token:', token)
      try {
        //Pass the user details to the next middleware
        const user = await staffs.get(token.user)
        return done(null, user)
      } catch (error) {
        done(error)
      }
    },
  ),
)
