/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { encrypt, decrypt, nano, socket, dbName } = require('../../../shared/index')

const LOG = {
  type: '',
  key: '',
  reason: '',
  at: 0,
  by: {},
  note: '',
  _rev: '',
  lastVal: null,
  newVal: null,
}
Object.freeze(LOG)

router.get(
  '/orders/film',
  function(req, res, next) {
    console.log(req.headers)
    next()
  },
  async function(req, res) {
    console.log('req.db', req.db)
    try {
      if (!req.db.seq) {
        await req.db.getSeq()
      }
      const _body = await req.db.db.list({ include_docs: true })
      const _rows = _body.rows
      const _docs = _rows.map(row => row.doc)
      res.json({ docs: _docs, seq: req.db.seq })
    } catch (e) {
      console.error(e)
    }
  },
)

// router.get('/sync/:seq', async function(req, res) {
//   //   console.log('(/sync/:seq) req.params: ', req.params)
//   try {
//     const _clientEncryptedSeq = req.params.seq
//     if (!dbSeq) dbSeq = await getdbSeq()
//     if (dbSeq === _clientEncryptedSeq) res.sendStatus(204)
//     else {
//       const _clientSeq = decrypt(_clientEncryptedSeq)
//       console.log('GET /sync _clientSeq', _clientSeq)
//       const _changes = await orders.changes({ include_docs: true, since: _clientSeq })
//       console.log('GET /sync orders.changes', _changes)
//       const _docsChanged = _changes.results.map(r => r.doc)
//       dbSeq = await getdbSeq()
//       // console.log('GET /sync dbSeq', dbSeq)
//       res.json({ docs: _docsChanged, seq: dbSeq })
//     }
//   } catch (e) {
//     console.error(e)
//   }
// })

// Exports
// -------

module.exports = router
