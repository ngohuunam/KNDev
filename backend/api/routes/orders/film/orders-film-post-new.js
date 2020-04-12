const ordersFilmPostNew = async ({ db, body, user }, res, next) => {
  try {
    if (!db || !db.isRunning()) return next({ statusCode: 501, message: `db ${db.name} not found` })
    const _newOrder = body
    _newOrder.createdAt = Date.now()
    /* create log */
    _newOrder.logs.unshift({ type: 'Create', at: Date.now(), by: user._id })
    const _doc = await db.new(_newOrder, user)
    const _res = { doc: _doc, seq: db.seq }
    return res.status(200).json(_res)
  } catch (e) {
    if (e.message.includes('conflict')) e.info = JSON.parse(JSON.stringify(e))
    return next(e)
  }
}

module.exports = ordersFilmPostNew
