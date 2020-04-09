const { decrypt } = require('@shared')

const ordersFilmGetSync = async ({ db, params, user }, res, next) => {
  try {
    if (!db || !db.isRunning()) return next({ statusCode: 501, message: `db ${db.name} not found` })
    const _clientEncryptedSeq = params.seq
    if (db.seq === _clientEncryptedSeq) return res.sendStatus(204)
    const _clientSeq = decrypt(_clientEncryptedSeq)
    const _docsChanged = await db.sync(_clientSeq, user)
    const _res = { news: [], deleted: [], changes: [], seq: db.seq }
    _docsChanged.map(_doc => {
      if (_doc._rev.startsWith('1-')) _res.news.push(_doc)
      else if (_doc.deleted) _res.deleted.push(_doc)
      else _res.changes.push(_doc)
    })
    return res.status(200).json(_res)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmGetSync
