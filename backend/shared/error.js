const nextErr = (err, logger, next) => {
  logger.error(err)
  return next(err)
}

const throwErr = (err, logger) => {
  logger.error(err)
  throw new Error(err)
}

module.exports = { nextErr, throwErr }
