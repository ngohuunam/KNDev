const { resolve } = require('path')
const { lookup } = require('mime-types')
const { doCompress } = require('./stream')
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
 * Search brotli or gzip encode is accepted, if not send original file
 * brotli is prioriti than gzip
 * Search file brotli or gzip to send
 * if file brotli or gzip not existed, send original file
 * and make new brotli or gzip file
 */
const sendCompressed = (input, headers, res, next, contentType) => {
  const isBrotliAccepted = headers['accept-encoding'].includes('br')
  const isGzipAccepted = headers['accept-encoding'].includes('gzip')
  const encoding = isBrotliAccepted ? 'br' : isGzipAccepted ? 'gzip' : ''
  const fileExt = isBrotliAccepted ? '.br' : isGzipAccepted ? '.gz' : ''
  const _contentType = contentType || lookup(input)
  // console.log('_contentType:', _contentType)
  if (isBrotliAccepted || isGzipAccepted) {
    const options = {
      headers: {
        'Content-Type': _contentType,
        'Content-Encoding': encoding,
      },
    }
    const output = input + fileExt
    res.sendFile(resolve(output), options, async err => {
      if (err) {
        if (err.message.indexOf('no such file') > -1) {
          try {
            sendFile(res, next, input)
            await doCompress(input, output, isBrotliAccepted)
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
  sendCompressed(input, headers, res, next, 'text/html')
}

module.exports = { sendCompressed, sendLogin }
