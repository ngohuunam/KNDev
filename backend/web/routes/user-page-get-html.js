const { streamRender } = require('../../shared')

/* GET user page. */
const userPageGetHtml = async ({ params, user }, res) => {
  // console.log('GET / next param', req.params)
  const { token } = params
  return await streamRender(
    `/${user.dept}/${user.page}`,
    [
      { key: '{{title}}', value: user._id },
      { key: `/${user.dept}/${user.page}`, value: `/${user.dept}/${user.page}/${token}` },
    ],
    res,
  )
}

module.exports = userPageGetHtml
