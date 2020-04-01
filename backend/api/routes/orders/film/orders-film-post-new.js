const ordersFilmPostNew = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return res.status(501).json(`db ${_db.name} not found`)
    const _newOrder = req.body
    _newOrder.createdAt = Date.now()
    /* create order log */
    const _log = {}
    _log.type = 'Create'
    _log.at = _newOrder.createdAt
    _log.by = _newOrder.createdBy
    /* update order log */
    _newOrder.logs.push(_log)
    const _doc = await _db.new(_newOrder, req.user)
    return res.status(200).json(_doc)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmPostNew
