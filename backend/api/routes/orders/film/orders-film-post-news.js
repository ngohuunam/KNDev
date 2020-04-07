const ordersFilmPostNew = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return next({ statusCode: 501, message: `db ${_db.name} not found` })
    const _newOrders = req.body
    _newOrders.map(_newOrder => {
      _newOrder.createdAt = Date.now()
      /* create order log */
      const _log = {}
      _log.type = 'Create'
      _log.at = _newOrder.createdAt
      _log.by = _newOrder.createdBy
      _log.note = _newOrder.note
      /* update order log */
      _newOrder.logs.push(_log)
    })
    const _docs = await _db.news({ docs: _newOrders, include_docs: true }, req.user)
    const _res = { new: [], old: [], err: [], other: [], seq: _db.seq }
    _docs.map(_doc => {
      if (_doc.ok && _doc.rev.startsWith('1-')) _res.new.push(_doc)
      else if (_doc.ok) _res.old.push(_doc)
      else if (_doc.error) _res.err.push(_doc)
      else _res.other.push(_doc)
    })
    return res.status(200).json(_res)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmPostNew
