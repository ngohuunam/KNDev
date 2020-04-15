const { Transform } = require('stream')
const { StringDecoder } = require('string_decoder')
const { createReadStream, createWriteStream } = require('fs')
const { promisify } = require('util')
const { pipeline } = require('stream')
const { createBrotliCompress, createGzip } = require('zlib')
const { initLogger } = require('./logger')

const streamLogger = initLogger('shared/stream')

// var appendTransform = new Transform({
//   transform(chunk, encoding, callback) {
//     callback(null, chunk)
//   },
//   flush(callback) {
//     this.push('ghi')
//     callback()
//   },
// })

class ReplaceStringStream extends Transform {
  constructor(options, regex, replace) {
    super(options)
    this.regex = regex
    this.replace = replace
    // The stream will have Buffer chunks. The
    // decoder converts these to String instances.
    this._decoder = new StringDecoder('utf-8')
  }
  _transform(chunk, encoding, callback) {
    // Convert the Buffer chunks to String.
    if (encoding === 'buffer') chunk = this._decoder.write(chunk)

    chunk = chunk.replace(this.regex, this.replace)

    // Pass the chunk on.
    callback(null, chunk)
  }
}

class ReplaceStringsStream extends Transform {
  constructor(options, regexs_replaces) {
    super(options)
    this.regexs_replaces = regexs_replaces
    // The stream will have Buffer chunks. The
    // decoder converts these to String instances.
    this._decoder = new StringDecoder('utf-8')
  }
  _transform(chunk, encoding, callback) {
    // Convert the Buffer chunks to String.
    if (encoding === 'buffer') chunk = this._decoder.write(chunk)

    this.regexs_replaces.map(rr => (chunk = chunk.replace(rr.regex, rr.replace)))

    // console.log('stream_render chunk', chunk)
    // Pass the chunk on.
    callback(null, chunk)
  }
}

class InsertTokenStream extends Transform {
  constructor(options, regexs, token) {
    super(options)
    this.regexs = regexs
    this.token = token
    // The stream will have Buffer chunks. The
    // decoder converts these to String instances.
    this._decoder = new StringDecoder('utf-8')
    this.replaced = null
  }
  _transform(chunk, encoding, callback) {
    // Convert the Buffer chunks to String.
    if (encoding === 'buffer') chunk = this._decoder.write(chunk)

    function getAllIndexes(string, substring) {
      var a = [],
        i = -1
      while ((i = string.indexOf(substring, i + 1)) > -1) a.push(i)
      return a.reverse()
    }

    this.regexs.map(r => {
      const indexs = getAllIndexes(chunk, r)
      // console.log('InsertTokenStream indexs: ', indexs)
      // console.log('InsertTokenStream chunk: ', chunk)
      indexs.map(index => {
        // console.log('index: ', index)
        // console.log('chunk[index]: ', chunk[index])
        const startIndex = chunk.lastIndexOf('"', index) + 1
        const found = chunk.substring(startIndex, index + 10)
        // console.log('InsertTokenStream found: ', found)

        // console.log('InsertTokenStream this.token: ', this.token)
        const replace = this.token.concat('/', found)
        // console.log('InsertTokenStream replace: ', replace)

        chunk = chunk.replace(found, replace)
        // console.log('InsertTokenStream chunk replaced: ', chunk)})
      })
    })
    // Pass the chunk on.
    callback(null, chunk)
  }
}

const pipe = promisify(pipeline)
const doCompress = async (input, output, isBrotli, regex, replace) => {
  const compress = isBrotli ? createBrotliCompress() : createGzip()
  const source = createReadStream(input)
  const destination = createWriteStream(output)
  const replaceStream = new ReplaceStringStream(null, regex, replace)
  if (regex instanceof RegExp && typeof replace === 'string') await pipe(source, replaceStream, compress, destination)
  else await pipe(source, compress, destination)
}

const readReplaceRes = async (input, regex, replace, res) => {
  const source = createReadStream(input)
  const replaceStream = new ReplaceStringStream(null, regex, replace)
  await pipe(source, replaceStream, res)
}

const readReplaceMultiRes = async (input, regexs_replaces, res) => {
  const source = createReadStream(input)
  const replaceStream = new ReplaceStringsStream(null, regexs_replaces)
  await pipe(source, replaceStream, res)
}

const insertTokenRes = async (input, regexs, token, res) => {
  const source = createReadStream(input)
  const replaceStream = new InsertTokenStream(null, regexs, token)
  await pipe(source, replaceStream, res)
}

const streamRender = async (path, keys_values, res, isSingle) => {
  let regexs_replaces = []
  keys_values.map(({ key, value }) => {
    const regex = new RegExp(key, 'g')
    const replace = value
    regexs_replaces.push({ regex: regex, replace: replace })
  })
  // console.log('stream_render regexs_replaces', regexs_replaces)
  const input = isSingle ? `web/pages/${path}/index_.html` : `web/pages/${path}/index.html`
  // console.log('stream_render input', input)
  const source = createReadStream(input)
  const replaceStream = new ReplaceStringsStream(null, regexs_replaces)
  await pipe(source, replaceStream, res)
}

const redirectToLogin = (res, code, mess) => {
  res.status(code)
  streamLogger.error(`Response ${code}: ${mess}`)
  streamRender('relogin', [{ key: 'Type Email & Password and Login', value: `Res ${code}: ${mess}` }], res)
}

module.exports = {
  ReplaceStringStream,
  readReplaceRes,
  doCompress,
  streamRender,
  redirectToLogin,
  readReplaceMultiRes,
  insertTokenRes,
}
