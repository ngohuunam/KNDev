<template>
  <div>
    <div class="p-grid p-fluid" v-for="({ label, comp, key, options, showTime, optionLabel, optionValue }, i) in labels" :key="i">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ label }}</label>
      </div>
      <div class="p-col-8">
        <component :is="comp" v-model="newProd[key]" :options="options" :showTime="showTime" :optionLabel="optionLabel" :optionValue="optionValue" />
      </div>
    </div>
    <NewEditor v-model="newProd.details" NewEditorStyle="height: 60px" :readOnly="disabled">
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
    </NewEditor>
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" :disabled="disabled" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
// import { prod } from '@/assets/defaultState'

export default {
  name: 'OrderFilmNewProdForm',
  components: {},
  props: {
    cp: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      note: '',
      labels: [
        { label: 'Product Name:', comp: 'InputText', key: 'name' },
        { label: 'Type:', comp: 'Dropdown', key: 'type', options: ['Offset Print', 'Digital Print', 'Social Media', 'Web', 'Other'] },
        { label: 'End at:', comp: 'NewCalendar', key: 'endAt', showTime: false },
        { label: 'Processes:', comp: 'Dropdown', key: 'processes', options: [], optionLabel: 'label', optionValue: 'properties' },
      ],
    }
  },
  methods: {
    checkExisted() {
      if (this.cp.products.some(name => name === this.newProd.name)) return this.newProd.name + ' existed'
      else {
        this.newProd._id = `${this.cp._id}:${this.newProd.name.to_id()}`
        this.newProd.parent._id = this.cp._id
        this.newProd.parent._rev = this.cp._rev
        this.newProd.note = this.$randomSentence()
        return ''
      }
    },
    checkRequired() {
      const fields = ['name', 'type', 'process']
      const texts = ['Product name', 'Produce type', 'Process']
      const misses = fields.reduce((pre, field, i) => [...pre, ...(this.newProd[field] ? [] : [texts[i]])], [])
      return misses.length ? misses.join(', ') + ' can not empty' : ''
    },
    confirm() {
      let text = this.checkRequired()
      if (text) this.dialogMess = { text, severity: 'error' }
      else {
        text = this.checkExisted()
        if (text) this.dialogMess = { text, severity: 'error' }
        else {
          this.$store.commit('prod/film/create', this.newProd)
          this.$emit('switch-comp', 'newProdConfirm', 'Save', 'Save new product confirm', this.cp)
          this.dialogMess = { text: '', severity: '' }
        }
      }
    },
    // doCreate(checked) {
    //   if (!checked) {
    //     let text = this.checkRequired()
    //     if (text) this.dialogMess = { text, severity: 'error' }
    //     else {
    //       text = this.checkExisted()
    //       if (text) this.dialogMess = { text, severity: 'error' }
    //       else {
    //         this.$store.commit('prod/film/create', this.newProd)
    //         this.$emit('switch-comp', 'newProdConfirm', 'Save', 'Save new product confirm', this.cp)
    //         this.dialogMess = { text: '', severity: '' }
    //       }
    //     }
    //   }
    // },
  },
  computed: {
    // labels() {
    //   const labels = this.$store.state.prod.film.labels.slice(0)
    //   labels[labels.length - 1].options = this.$store.state.processes.map(proc => proc._id)
    //   return labels
    // },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
    construct() {
      return this.$store.getters['prod/construct']('film')
    },
    newProd: {
      get() {
        return this.$store.state.prod.film.new
      },
      set(value) {
        this.$store.commit('prod/film/setState', { key: 'new', data: value })
      },
    },
  },
  created() {
    if (!this.newProd) this.newProd = this.$randomNewProdFilm(this.construct)
    const _processLabel = this.labels.find(label => label.key === 'processes')
    _processLabel.options = this.$store.state.standards.filter(({ type, db, cols }) => type === 'procs' && db === 'prod' && cols.includes('film'))
  },
  beforeDestroy() {},
}
</script>

<style scoped></style>
