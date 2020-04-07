import io from 'socket.io-client'
import { Store, get } from 'idb-keyval'

const user_store = new Store('kn', 'user')
let userInfo
let socket
const Console = self.console
const PostMessage = self.postMessage

const connect = origin => {
  get('info', user_store)
    .then(_info => {
      userInfo = _info
      Console.log('userInfo', userInfo)
      const url = `${origin}/${userInfo.dept}/${userInfo.page}?token=${userInfo.token}`
      socket = io(url)
      onEvent()
    })
    .catch(e => Console.log(e))
}

const func = { connect }

self.onmessage = ({ data }) => {
  Console.log('data', data)
  const { name, payload } = data
  func[name](payload)
}

const onEvent = () => {
  PostMessage('ok')
  Console.log('socket', socket)
  // ;['onmessage', 'onclose', 'onerror', 'onopen'].forEach(event => {
  //   socket[event] = async mess => {
  //     const data = mess.data ? JSON.parse(mess.data) : { func: null }
  //     console.log(`[socket ${event} received]`, data)
  //     switch (event) {
  //       case 'onopen':
  //         console.log('socket', socket)
  //     }
  //   }
  // })
}
