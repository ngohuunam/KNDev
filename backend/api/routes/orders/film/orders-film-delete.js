const ordersFilmDelete = async ({ db, body, user }, res, next) => {
  try {
    if (!db || !db.isRunning()) return next({ statusCode: 501, message: `db ${db.name} not found` })
    body.map(_doc => {
      _doc.deleted = Date.now()
      _doc.logs.unshift({ type: 'delete', at: Date.now(), by: user._id })
    })
    const _dbRes = await db.delete({ docs: body }, user)
    const _res = { ok: [], err: [], other: [], seq: db.seq }
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
