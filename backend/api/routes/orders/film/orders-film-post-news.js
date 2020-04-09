const ordersFilmPostNew = async ({ db, body, user }, res, next) => {
  try {
    if (!db || !db.isRunning()) return next({ statusCode: 501, message: `db ${db.name} not found` })
    const _newOrders = body
    _newOrders.map(_newOrder => {
      _newOrder.createdAt = Date.now()
      /* create order log */
      _newOrder.logs.unshift({ type: 'Create', at: Date.now(), by: user._id })
    })
    const _docs = await db.news({ docs: _newOrders, include_docs: true }, user)
    const _res = { news: [], err: [], other: [], seq: db.seq }
    _docs.map(_doc => {
      if (_doc.ok && _doc.rev.startsWith('1-')) _res.news.push(_doc)
      else if (_doc.error) _res.err.push(_doc)
      else _res.other.push(_doc)
    })
    return res.status(200).json(_res)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmPostNew
