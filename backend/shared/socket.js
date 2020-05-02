const socket_io = require('socket.io')
const { secret, couchdb } = require('./setting')
const nano = require('nano')(couchdb)
const staffs = nano.use('staffs')
const standard = nano.use('standard')
const { verify } = require('jsonwebtoken')
const { initLogger } = require('./logger')
const skLogger = initLogger('shared/socketio')

const io = socket_io()
const skApi = {}
skApi.io = io

const auth = async (socket, next) => {
  const token = socket.handshake.query.token
  if (!token) {
    skLogger.error(`Token missed: ${token}`)
    return next(new Error(`Token err: ${token}`))
  }
  try {
    const decoded = verify(token, secret.web)
    const user = await staffs.get(decoded.user)
    socket.user = user
    return next()
  } catch (err) {
    console.log('err: ', err)
    return next(new Error(err.message))
  }
}

io.use(auth)
// io.on('connection', socket => {
//   skLogger.info(`${socket.id} - ip: ${socket.handshake.address} connected'`)
//   console.log(socket)
//   socket.on('all', message => {
//     console.log(message)
//     console.log(socket)
//   })
// })

const sales_home = io.of('/sales/home')
sales_home.use(auth)
sales_home.on('connect', async socket => {
  skLogger.info(`${socket.id} - ip: ${socket.handshake.address} - user: ${socket.user._id} connected'`)
  console.log(`${socket.id} - ip: ${socket.handshake.address} - user: ${socket.user._id} connected'`)
  socket.join('order.film', () => {
    // let rooms = Object.keys(socket.rooms)
    // console.log('rooms: ', rooms)
  })
  const newNamespace = socket.nsp
  // broadcast to all clients in the given sub-namespace
  try {
    const { rows } = await standard.list({ include_docs: true })
    const data = rows.map(row => row.doc)
    newNamespace.emit('setState', { key: 'standards', data })
  } catch (err) {
    skLogger.error(err)
  }
  // console.log('newNamespace: ', newNamespace)
})
sales_home.on('error', err => {
  console.error(err)
})

skApi.sendNotification = (EVENT, data) => {
  console.log('event: ', EVENT)
  console.log('data: ', data)
  sales_home.emit(EVENT, data)
}

skApi.reloadWindow = () => {
  sales_home.emit('reload')
}
skApi.sales_home = sales_home
module.exports = skApi
