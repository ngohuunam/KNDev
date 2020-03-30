const socket_io = require('socket.io')
const io = socket_io()
const skApi = {}

skApi.io = io

io.on('connection', socket => {
  console.log('A user connected')
  socket.on('all', message => {
    console.log(message)
  })
})

skApi.sendNotification = (EVENT, data) => {
  io.sockets.emit(EVENT, data)
}

skApi.reloadWindow = EVENT => {
  io.sockets.emit(EVENT)
}

module.exports = skApi
