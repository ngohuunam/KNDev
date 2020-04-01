const { sendGzip } = require('../../shared/index')

/* GET user page's assets. */
const userPageGetAssets = async (req, res, next) => {
  // console.log('GET / (assets) next param', req.params)
  const _input = req.params.folder
    ? `web/pages/${req.params.dept}/${req.params.page}/${req.params.folder}/${req.params.file}`
    : `web/pages/${req.params.dept}/${req.params.page}/${req.params.file}`
  return sendGzip(_input, req, res, next)
}

module.exports = userPageGetAssets
