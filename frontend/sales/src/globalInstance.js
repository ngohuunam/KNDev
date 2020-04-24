// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { tToString, isObjEmpty } from './utils'
import { randomNewOrderFilm, randomSentence, randomNewProdFilm } from './utils/dev'

// const toProperCase = function() {
//   return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//   })
// }

// String.prototype.toProperCase = toProperCase
// String.prototype.to_id = function() {
//   return this.toProperCase().replace(/\s/g, '_')
// }
// String.prototype.insert = function(index, string) {
//   if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length)

//   return string + this
// }

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
