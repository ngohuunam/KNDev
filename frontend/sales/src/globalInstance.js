// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { tToString, isObjEmpty } from './tools'

const install = Vue => {
  // 4. add an instance method
  Vue.prototype.$tToString = tToString
  Vue.prototype.$log = console.log.bind(console)
  Vue.prototype.$isObjEmpty = isObjEmpty
}
export { install }
