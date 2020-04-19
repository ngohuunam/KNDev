// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { tToString, isObjEmpty } from './tools'
import { randomNewOrderFilm, randomSentence, randomNewProdFilm } from './utils/dev'

const install = Vue => {
  // 4. add an instance method
  Vue.prototype.$tToString = tToString
  Vue.prototype.$log = console.log.bind(console)
  Vue.prototype.$isObjEmpty = isObjEmpty
  Vue.prototype.$randomNewOrderFilm = randomNewOrderFilm
  Vue.prototype.$randomSentence = randomSentence
  Vue.prototype.$randomNewProdFilm = randomNewProdFilm
}
export { install }
