<template>
  <div style="text-align: left;">
    <div class="p-grid p-fluid" v-for="(item, i) in labels" :key="i">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ item.label }}</label>
      </div>
      <div class="p-col-8">
        <InputText v-if="item.inputType === 'text'" v-model="newOrder[item.key]" />
        <NewCalendar v-else-if="item.inputType === 'calendar'" :showTime="item.showTime" v-model="newOrder[item.key]" />
        <Dropdown v-else-if="item.inputType === 'dropdown'" v-model="newOrder[item.key]" :options="item.options" />
      </div>
    </div>
    <!-- <div class="p-grid p-fluid"> -->
    <!-- <div class="p-col-4" style="margin: auto;">
        <label>Log:</label>
      </div>
      <div class="p-col-8"></div> -->
    <!-- <div class="p-col-12"> -->
    <Editor v-model="note" editorStyle="height: 60px">
      <template slot="toolbar">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </template>
    </Editor>
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
// import { order } from '@/assets/defaultState'
// Object.freeze(defaultState.newOrder)

export default {
  name: 'OrderFilmNewOrderForm',
  components: {},
  data() {
    return { note: '' }
  },
  methods: {
    checkExisted() {
      if (this.state.list.some(item => item.foreignTitle === this.newOrder.foreignTitle)) return this.newOrder.foreignTitle + ' existed'
      return ''
    },
    checkRequired() {
      const fields = ['foreignTitle', 'team']
      const texts = ['Foreign Title', "Client's Team"]
      const misses = fields.reduce((pre, field, i) => [...pre, ...(this.newOrder[field] ? [] : [texts[i]])], [])
      return misses.length ? misses.join(', ') + ' can not empty' : ''
    },
    confirm() {
      let text = this.checkRequired()
      if (text) this.dialogMess = { text, severity: 'error' }
      else {
        text = this.checkExisted()
        if (text) this.dialogMess = { text, severity: 'error' }
        else {
          this.$store.commit('order/film/create', { note: this.$randomSentence() })
          this.$emit('switch-comp', 'newOrderConfirm', 'Save', 'Save new order confirm')
          this.dialogMess = { text: '', severity: '' }
        }
      }
    },
    doCreate() {
      if (this.newOrder.foreignTitle) {
        this.$store.commit('order/film/create', { note: this.$randomSentence() })
        this.$emit('switch-comp', 'newOrderConfirm', 'Save', 'Save new order confirm')
        this.dialogMess = { text: '', severity: '' }
      } else this.dialogMess = { text: 'Foreign Title required', severity: 'error' }
    },
  },
  computed: {
    state() {
      return this.$store.state.order.film
    },
    labels() {
      return this.state.labels
    },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
    construct() {
      return this.$store.getters['order/construct']('film')
    },
    newOrder: {
      get() {
        return this.state.new
      },
      set(value) {
        this.$store.commit('order/film/setState', { key: 'new', data: value })
      },
    },
  },
  created() {
    this.newOrder = this.newOrder || this.$randomNewOrderFilm(this.construct)
  },
  beforeDestroy() {},
}
</script>

<style scoped></style>
