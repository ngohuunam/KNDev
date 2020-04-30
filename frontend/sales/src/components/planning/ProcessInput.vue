<template>
  <div class="p-grid p-fluid">
    <div class="p-col-12">
      <div class="p-grid p-fluid process-list" v-for="({ label, comp, key, options, showTime }, i) in labels" :key="i">
        <div class="p-col-4" style="margin: auto;">
          <label>{{ label }}</label>
        </div>
        <div class="p-col-8">
          <component :is="comp" v-model="values[key]" :options="options" :showTime="showTime" />
        </div>
      </div>
    </div>
    <div class="p-col">
      <Button label="Cancel" icon="pi pi-times" @click="cancel" class="p-button-danger" />
    </div>
    <div class="p-col-1" />
    <div class="p-col">
      <Button label="Save" icon="pi pi-check" @click="save" class="p-button-success" />
    </div>
  </div>
</template>

<script>
const labels = [
  { label: 'Source:', comp: 'InputText', key: 'source' },
  { label: 'Target:', comp: 'InputText', key: 'target' },
  { label: 'Description:', comp: 'InputText', key: 'description' },
  { label: 'Main Response:', comp: 'Dropdown', key: 'main', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
  { label: 'Supporter:', comp: 'Dropdown', key: 'support', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
  { label: 'Begin At:', comp: 'NewCalendar', key: 'start', showTime: false, disable: false },
  { label: 'End At:', comp: 'NewCalendar', key: 'end', showTime: false },
  { label: 'Type:', comp: 'MultiSelect', key: 'type', options: ['Serial', 'Parallel', 'Pausable', 'Cancelable', 'Holdable'], placeholder: 'Select Types' },
]
// const values = labels.reduce((pre, cur) => ({ ...pre, ...{ [cur.key]: cur.options ? [] : null } }), {})

export default {
  props: ['proc_id', 'index'],
  data() {
    return {
      // values,
      labels,
    }
  },
  methods: {
    cancel() {
      console.log(this.proc_id)
      console.log(this.$store.getters['operation/process/getBy_id'](this.proc_id))
    },
    save() {
      console.log(this.proc_id)
      console.log(this.$store.getters['operation/process/getBy_id'](this.proc_id))
    },
  },
  computed: {
    values: {
      get() {
        return this.$store.state.operation.process.list[this.index]
      },
      set(v) {
        // this.$store.commit('operation/process/replace', { key: 'list', prop: '_id', compare: this.proc_id, data: v })
        this.$store.commit('operation/process/replaceAt', { key: 'list', index: this.index, data: v })
      },
    },
  },
}
</script>
