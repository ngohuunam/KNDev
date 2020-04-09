const ordersFilmGetAll = async ({ db, user }, res, next) => {
  try {
    if (!db || !db.isRunning()) return next({ statusCode: 501, message: `db ${db.name} not found` })
    const _docs = await db.all(user)
    const _res = { docs: _docs.filter(doc => !doc._id.includes('_design')), seq: db.seq }
    return res.status(200).json(_res)
  } catch (e) {
    return next(e)
  }
}

module.exports = ordersFilmGetAll
