const ordersFilmGetAll = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return next({ statusCode: 501, message: `db ${_db.name} not found` })
    const _docs = await _db.all(req.user)
    return res.status(200).json({ docs: _docs, seq: _db.seq })
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmGetAll
