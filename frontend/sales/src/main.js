import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import DataTable from 'primevue/datatable'
Vue.component('DataTable', DataTable)

import Column from 'primevue/column'
Vue.component('Column', Column)
const NewColumn = Vue.component('Column').extend({
  props: {
    filterMatchMode: {
      type: String,
      default: 'contains',
    },
    sortable: {
      type: Boolean,
      default: true,
    },
  },
})
Vue.component('NewColumn', NewColumn)

import ColumnGroup from 'primevue/columngroup'
Vue.component('ColumnGroup', ColumnGroup)

import InputText from 'primevue/inputtext'
Vue.component('InputText', InputText)

import Calendar from 'primevue/calendar'
Vue.component('Calendar', Calendar)
const NewCalendar = Vue.component('Calendar').extend({
  props: {
    showIcon: {
      type: Boolean,
      default: true,
    },
    hideOnDateTimeSelect: {
      type: Boolean,
      default: true,
    },
    monthNavigator: {
      type: Boolean,
      default: true,
    },
    yearNavigator: {
      type: Boolean,
      default: true,
    },
    yearRange: {
      type: String,
      default: '2020:2030',
    },
    showOnFocus: {
      type: Boolean,
      default: false,
    },
    showButtonBar: {
      type: Boolean,
      default: true,
    },
    manualInput: {
      type: Boolean,
      default: false,
    },
  },
})
Vue.component('NewCalendar', NewCalendar)

import MultiSelect from 'primevue/multiselect'
Vue.component('MultiSelect', MultiSelect)

import ToastService from 'primevue/toastservice'
Vue.use(ToastService)
import Toast from 'primevue/toast'
Vue.component('Toast', Toast)
const NewToast = Vue.component('Toast').extend({
  name: 'NewToast',
  methods: {
    remove(message) {
      let index = -1
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i] === message) {
          index = i
          break
        }
      }
      this.messages.splice(index, 1)
      this.$emit('close', message.detail)
    },
  },
})
Vue.component('NewToast', NewToast)

import Button from 'primevue/button'
Vue.component('Button', Button)

import Dialog from 'primevue/dialog'
Vue.component('Dialog', Dialog)
const NewDialog = Vue.component('Dialog').extend({
  name: 'NewDialog',
  props: ['disableKeyTab'],
  documentKeyupListener: null,
  methods: {
    newOnKeyDown() {},
    replaceOnKeyDown(e) {
      if (!this.disableKeyTab) this.newOnKeyDown(e)
    },
    onKeyUp(event) {
      if (event.which === 13) {
        this.$emit('keyup-enter', event)
      } else if (event.which === 27) {
        this.$emit('keyup-escape', event)
      }
    },
    bindDocumentKeyupListener() {
      if (!this.documentKeyupListener) {
        this.documentKeyupListener = this.onKeyUp.bind(this)
        window.document.addEventListener('keyup', this.documentKeyupListener)
      }
    },
    unbindDocumentKeyupListener() {
      if (this.documentKeyupListener) {
        window.document.removeEventListener('keyup', this.documentKeyupListener)
        this.documentKeyupListener = null
      }
    },
  },
  created() {
    this.newOnKeyDown = this.onKeyDown
    this.onKeyDown = this.replaceOnKeyDown
  },
  mounted() {
    this.bindDocumentKeyupListener()
    this.removeStylesFromMask()
  },
  beforeDestroy() {
    this.disableDocumentSettings()
    this.unbindDocumentKeyupListener()
  },
})
Vue.component('NewDialog', NewDialog)

import Checkbox from 'primevue/checkbox'
Vue.component('Checkbox', Checkbox)

import ToggleButton from 'primevue/togglebutton'
Vue.component('ToggleButton', ToggleButton)

import ProgressBar from 'primevue/progressbar'
Vue.component('ProgressBar', ProgressBar)

import Dropdown from 'primevue/dropdown'
Vue.component('Dropdown', Dropdown)

import BlockUI from 'primevue/blockui'
Vue.component('BlockUI', BlockUI)

import ProgressSpinner from 'primevue/progressspinner'
Vue.component('ProgressSpinner', ProgressSpinner)

import Message from 'primevue/message'
Vue.component('Message', Message)
const NewMessage = Vue.component('Message').extend({
  name: 'NewMessage',
  props: ['index'],
  watch: {
    visible: function(v) {
      if (v === false) this.$emit('close-message', this.index)
    },
  },
})
Vue.component('NewMessage', NewMessage)

import Menu from 'primevue/menu'
Vue.component('Menu', Menu)

import ContextMenu from 'primevue/contextmenu'
Vue.component('ContextMenu', ContextMenu)

import Chips from 'primevue/chips'
Vue.component('Chips', Chips)

import Editor from 'primevue/editor'
Vue.component('Editor', Editor)
const NewEditor = Vue.component('Editor').extend({
  name: 'NewEditor',
  props: ['readOnly'],
})
Vue.component('NewEditor', NewEditor)

import Textarea from 'primevue/textarea'
Vue.component('Textarea', Textarea)

import FileUpload from 'primevue/fileupload'
Vue.component('FileUpload', FileUpload)

import InputMask from 'primevue/inputmask'
Vue.component('InputMask', InputMask)

import Tooltip from 'primevue/tooltip'
Vue.directive('tooltip', Tooltip)

// import OverlayPanel from 'primevue/overlaypanel'
// Vue.component('OverlayPanel', OverlayPanel)

import 'primevue/resources/themes/nova-light/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@/assets/myCss.css'

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true

// import defaultState from '@/assets/defaultState'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import * as globalInstance from './globalInstance'

// console.log('store', store)
const { user } = store.state
const { dept, page, token } = user
const url = `${window.location.origin}/${dept}/${page}?token=${token}`
// console.log('url', url)

const socket = io(url, {
  // WARNING: in that case, there is no fallback to long-polling
  transports: ['websocket', 'polling'], // or [ 'websocket', 'polling' ], which is the same thing
})
Vue.use(VueSocketIOExt, socket, { store })
Vue.use(globalInstance)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

router.replace('/')
