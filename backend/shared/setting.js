const { initLogger } = require('./logger')

const couchdbLogger = initLogger('shared/couch')

module.exports = {
  origin: [],
  couchdb: {
    url: process.env.COUCH_URL,
    // eslint-disable-next-line no-unused-vars
    log: id => {
      if (id.method) couchdbLogger.info(JSON.stringify(id))
      else if (id.err) couchdbLogger.error(JSON.stringify(id))
    },
    // parseUrl: false,
  },
  secret: { web: process.env.JWT_WEB, api: process.env.JWT_API, db: process.env.JWT_DB },
  dbOpt: {
    order: {
      film: { endpoint: 'order_film_2020', event: { new: 'ORDER_FILM_NEW', update: 'ORDER_FILM_UPDATE', delete: 'ORDER_FILM_DELETE' } },
    },
    prod: {
      film: { endpoint: 'prod_film_2020', event: { new: 'PROD_FILM_NEW', update: 'PROD_FILM_UPDATE', delete: 'PROD_FILM_DELETE' } },
    },
    operation: {
      process: { endpoint: 'op_proc_2020', event: { new: 'OP_PROC_NEW', update: 'OP_PROC_UPDATE', delete: 'OP_PROC_DELETE' } },
    },
  },
  dbLog: { orders: { film: 'order_film_2020' }, prod: { film: 'prod_film_2020' }, operation: { process: 'op_proc_2020' } },
}
