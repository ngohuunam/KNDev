const socket_io = require('socket.io')
const { secret, couchdb } = require('./setting')
const nano = require('nano')(couchdb)
const staffs = nano.use('staffs')
const { verify } = require('jsonwebtoken')
const { initLogger } = require('./logger')
const skLogger = initLogger('shared/socketio')

const io = socket_io()
const skApi = {}
skApi.io = io

const auth = async (socket, next) => {
  const token = socket.handshake.query.token
  if (!token) return next(new Error('authentication error'))
  try {
    const decoded = verify(token, secret.web)
    const user = await staffs.get(decoded.user)
    socket.user = user
    return next()
  } catch (err) {
    return next(new Error('authentication error'))
  }
}

// io.use(auth)
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
sales_home.on('connect', socket => {
  skLogger.info(`${socket.id} - ip: ${socket.handshake.address} - user: ${socket.user._id} connected'`)
  const newNamespace = socket.nsp // newNamespace.name === '/sales'
  // console.log(socket)
  // broadcast to all clients in the given sub-namespace
  newNamespace.emit('message', socket.id)
})

skApi.sendNotification = (EVENT, data) => {
  console.log('event: ', EVENT)
  console.log('data: ', data)
  sales_home.emit(EVENT, data)
}

skApi.reloadWindow = () => {
  sales_home.emit('reload')
}

module.exports = skApi
