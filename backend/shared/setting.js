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
    orders: {
      film: { name: 'order_film_2020', eventNew: 'ORDER_FILM_NEW', eventUpdate: 'ORDER_FILM_UPDATE', eventDelete: 'ORDER_FILM_DELETE' },
    },
  },
  dbLog: { orders: { film: 'order_film_2020' } },
}
