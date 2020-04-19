const { sendCompressed, insertTokenRes } = require('../../shared')

/* GET user page's assets. */
const userPageGetAssets = ({ params, headers }, res, next) => {
  // console.log('userPageGetAssets headers', headers)
  const { folder, dept, page, file, token } = params
  const _input = folder ? `web/pages/${dept}/${page}/${folder}/${file}` : `web/pages/${dept}/${page}/${file}`
  if (file.includes('app.js')) return insertTokenRes(_input, ['.worker.js'], token, res)
  return sendCompressed(_input, headers, res, next)
}

module.exports = userPageGetAssets
