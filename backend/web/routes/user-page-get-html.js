const { streamRender } = require('../../shared')

/* GET user page. */
const userPageGetHtml = async (req, res) => {
  // console.log('GET / next param', req.params)
  const token = req.params.token
  const _user = req.user
  return await streamRender(
    `/${_user.dept}/${_user.page}`,
    [
      { key: '{{title}}', value: _user._id },
      { key: `/${_user.dept}/${_user.page}`, value: `/${_user.dept}/${_user.page}/${token}` },
    ],
    res,
  )
}

module.exports = userPageGetHtml
