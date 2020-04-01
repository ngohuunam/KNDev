const nextErr = (err, logger, next) => {
  logger.debug(err)
  return next(err)
}

module.exports = { nextErr }
