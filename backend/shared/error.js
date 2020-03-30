const logger = require('./logger')

const nextErr = (err, next) => {
  logger.error(err)
  return next(err)
}

module.exports = { nextErr }
