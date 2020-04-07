const { sendGzip, readReplaceMultiRes } = require('../../shared')

/* GET user page's assets. */
const userPageGetAssets = async (req, res, next) => {
  // console.log('GET / (assets) next param', req.params)
  const { params } = req
  const { folder, dept, page, file, token } = params
  const _input = folder ? `web/pages/${dept}/${page}/${folder}/${file}` : `web/pages/${dept}/${page}/${file}`
  if (file.includes('app.js')) {
    return readReplaceMultiRes(
      _input,
      [
        { regex: 'new Worker(n.p+"', replace: `new Worker(n.p+"${token}/` },
        { regex: 'new Worker(__webpack_require__.p + \\"', replace: `new Worker(__webpack_require__.p + \\"${token}/` },
      ],
      res,
    )
  }
  return sendGzip(_input, req, res, next)
}

module.exports = userPageGetAssets
