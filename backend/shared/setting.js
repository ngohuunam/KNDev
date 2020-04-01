const { initLogger } = require('./logger')

const couchdbLogger = initLogger('shared/couch')

module.exports = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8080',
    'http://192.168.1.200:8080',
    'http://192.168.2.190:8080',
    'http://localhost:8081',
    'http://192.168.1.200:8081',
    'http://192.168.2.190:8081',
  ],
  // couchdb: 'http://hnam:1234@192.168.1.11:5984/',
  couchdb: {
    url: 'http://163.172.176.57:5984/',
    // eslint-disable-next-line no-unused-vars
    log: (id, args) => {
      // console.log(args)
      if (id.method) couchdbLogger.info(`${id.method} ${id.uri}`)
      else if (id.err) couchdbLogger.debug(`ERR: ${id.err}`)
    },
  },
  // couchdb: 'http://localhost:5984',
  secret: { web: 'NgoHuuNam', api: 'NgoHuuNam' },
  dbOpt: {
    orders: { film: { name: 'orders_film_2020', eventNew: 'ORDER_NEW', eventUpdate: 'ORDER_UPDATE', eventDelete: 'ORDER_DELETE' } },
  },
  dbLog: { orders: { film: 'orders_film_2020' } },
}
// http://163.172.176.57:5984/_utils/index.html
