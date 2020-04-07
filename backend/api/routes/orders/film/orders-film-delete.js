const ordersFilmDelete = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return next({ statusCode: 501, message: `db ${_db.name} not found` })
    const _dbRes = await _db.delete({ docs: req.body }, req.user)
    const _res = { ok: [], err: [], other: [], seq: _db.seq }
    _dbRes.map(_doc => {
      if (_doc.ok) _res.ok.push(_doc)
      else if (_doc.error) _res.err.push(_doc)
      else _res.other.push(_doc)
    })
    return res.status(200).json(_res)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmDelete
