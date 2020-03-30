const { resolve } = require('path')
const { lookup } = require('mime-types')
const logger = require('./logger')
const { doGzip } = require('./stream')

const handleErr = (info, err, next) => {
  logger.error(info || 'ERROR: ', err)
  return next(err)
}

const sendFile = (req, res, next, path, options) => {
  res.sendFile(resolve(path), options, error => {
    if (error) return handleErr(`(sendFile) ERROR:`, error, next)
    logger.info('(sendFile) OK: ' + path)
  })
}

/**
 * Search gzip encode is accepted, if not send original file
 * Search file gzip to send
 * if file gzip not existed, send orignal file
 * and make new gzip file
 */
const sendGzip = (input, req, res, next, contentType) => {
  const isGzipAccepted = req.headers['accept-encoding'].indexOf('gzip') > -1
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
            sendFile(req, res, next, input)
            await doGzip(input, output)
          } catch (e) {
            handleErr('PROMISE (do_gzip) ERROR: ', e)
          }
        } else handleErr('(sendFile) ERROR: ', err)
      } else logger.info('(sendFile) OK: ' + output)
    })
  } else sendFile(req, res, next, input)
}

/**
 * Short function to send login page
 */
const sendLogin = (req, res, next) => {
  const input = 'web/pages/login/index.html'
  sendGzip(input, req, res, next, 'text/html')
}

module.exports = { sendGzip, sendLogin }
