import Vue from 'vue'
import App from './App.vue'
import '@/assets/style.css'
// import * as globalInstance from './globalInstance'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

// Vue.use(globalInstance)

new Vue({
  render: h => h(App),
}).$mount('#app')
