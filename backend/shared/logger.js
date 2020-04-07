/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */
const appRoot = require('app-root-path')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint, colorize } = format

// Import Functions
const { File, Console } = transports

// const timezoned = () => {
//   const _opt = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
//   return new Date().toLocaleString('vi', _opt)
// }

const errorStackFormat = format(info => {
  if (info.stack) {
    // tslint:disable-next-line:no-console
    console.log(info.stack)
    return false
  }
  return info
})

const initLogger = fileName => {
  const options = {
    file_combined: {
      level: 'info',
      filename: `${appRoot}/logs/${fileName}-combined.log`,
      handleExceptions: false,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    file_error: {
      level: 'error',
      filename: `${appRoot}/logs/${fileName}-error.log`,
      handleExceptions: false,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'error',
      handleExceptions: false,
      json: false,
      colorize: true,
      format: combine(colorize()),
    },
  }
  const logger = createLogger({
    format: combine(
      timestamp({
        format: 'DD-MM-YYYY HH:mm',
      }),
      // simple(),
      prettyPrint(),
      errorStackFormat(),
    ),
    transports: [new File(options.file_combined), new File(options.file_error), new Console(options.console)],
    exitOnError: false, // do not exit on handled exceptions
  })

  logger.stream = {
    write: function(message) {
      logger.info(message)
    },
  }
  return logger
}

module.exports = { initLogger }
