const ordersFilmDelete = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return res.status(501).json(`db ${_db.name} not found`)
    const _dbRes = await _db.delete({ docs: req.body }, req.user)
    return res.status(200).json(_dbRes)
  } catch (e) {
    console.error(e)
    return next(e)
  }
}

module.exports = ordersFilmDelete
