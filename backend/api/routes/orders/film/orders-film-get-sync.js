const { decrypt } = require('@shared')

const ordersFilmGetSync = async (req, res, next) => {
  try {
    const _db = req.db
    if (!_db || !_db.isRunning()) return res.status(501).json(`db ${_db.name} not found`)
    const _clientEncryptedSeq = req.params.seq
    if (_db.seq === _clientEncryptedSeq) return res.sendStatus(204)
    const _clientSeq = decrypt(_clientEncryptedSeq)
    const _docsChanged = await _db.sync(_clientSeq, req.user)
    return res.status(200).json({ docs: _docsChanged, seq: _db.seq })
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmGetSync
