const { resolve } = require('path')
const { lookup } = require('mime-types')
const { doGzip } = require('./stream')
const { initLogger } = require('./logger')

const sendFileLogger = initLogger('shared/send-file')

const handleErr = (info, err, next) => {
  sendFileLogger.debug(info || 'ERROR: ', err)
  return next(err)
}

const sendFile = (res, next, path, options) => {
  res.sendFile(resolve(path), options, error => {
    if (error) return handleErr(`(sendFile) ERROR:`, error, next)
    sendFileLogger.info('(sendFile) OK: ' + path)
  })
}

/**
 * Search gzip encode is accepted, if not send original file
 * Search file gzip to send
 * if file gzip not existed, send orignal file
 * and make new gzip file
 */
const sendGzip = (input, headers, res, next, contentType) => {
  const isGzipAccepted = headers['accept-encoding'].includes('gzip')
  if (isGzipAccepted) {
    const options = {
      headers: {
        'Content-Type': contentType || lookup(input),
        'Content-Encoding': 'gzip',
      },
    }
    const output = input + '.gz'
    res.sendFile(resolve(output), options, async err => {
      if (err) {
        if (err.message.indexOf('no such file') > -1) {
          try {
            sendFile(res, next, input)
            await doGzip(input, output)
          } catch (e) {
            handleErr('PROMISE (do_gzip) ERROR: ', e)
          }
        } else handleErr('(sendFile) ERROR: ', err)
      } else sendFileLogger.info('(sendFile) OK: ' + output)
    })
  } else sendFile(res, next, input)
}

/**
 * Short function to send login page
 */
const sendLogin = ({ headers }, res, next) => {
  const input = 'web/pages/login/index.html'
  sendGzip(input, headers, res, next, 'text/html')
}

module.exports = { sendGzip, sendLogin }
