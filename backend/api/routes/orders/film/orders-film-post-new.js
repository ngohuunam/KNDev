const ordersFilmPostNew = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return next({ statusCode: 501, message: `db ${_db.name} not found` })
    const _newOrder = req.body
    _newOrder.createdAt = Date.now()
    /* create order log */
    const _log = {}
    _log.type = 'Create'
    _log.at = _newOrder.createdAt
    _log.by = _newOrder.createdBy
    _log.note = _newOrder.note
    /* update order log */
    _newOrder.logs.push(_log)
    const _doc = await _db.new(_newOrder, req.user)
    const _res = { doc: _doc, seq: _db.seq }
    return res.status(200).json(_res)
  } catch (e) {
    if (e.message.indexOf('conflict') > -1) e.info = JSON.parse(JSON.stringify(e))
    return next(e)
  }
}

module.exports = ordersFilmPostNew
