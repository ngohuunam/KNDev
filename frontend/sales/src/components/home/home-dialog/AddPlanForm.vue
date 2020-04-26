<template>
  <div style="text-align: left;">
    <div class="p-grid p-fluid margin-top margin-bot" style="text-align: center;">
      <div class="p-col">Previous: {{ previous.toUpperCase() }} Current process: {{ current.toUpperCase() }} Next: {{ next.toUpperCase() }}</div>
    </div>
    <div class="p-grid p-fluid" v-for="({ label, comp, key, options, showTime, disable }, i) in labels" :key="i">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ label }}</label>
      </div>
      <div class="p-col-8">
        <component :is="comp" :key="next" v-model="process[key]" :options="options" :showTime="showTime" :disabled="disable" />
      </div>
    </div>
    <div class="p-grid p-fluid">
      <div class="p-col">
        <Button v-if="previous" :label="previous.toUpperCase()" icon="pi pi-caret-left" @click="previousStep" class="p-button-success" />
      </div>
      <div class="p-col">
        <Button :label="current.toUpperCase()" icon="pi pi-caret-up" @click="currentStep" class="p-button-success" />
      </div>
      <div class="p-col">
        <Button v-if="next" :label="next.toUpperCase()" icon="pi pi-caret-right" @click="nextStep" class="p-button-success" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>

<script>
import { randomProcess } from '../../../utils/dev'

export default {
  name: 'AddPlanForm',
  components: {},
  props: ['cp'],
  data() {
    return {
      processes: null,
      stepNames: [],
      process: null,
      current: '',
      next: '',
      previous: '',
      labels: [
        { label: 'Source:', comp: 'InputText', key: 'source' },
        { label: 'Target:', comp: 'InputText', key: 'target' },
        { label: 'Description:', comp: 'InputText', key: 'description' },
        { label: 'Main Response:', comp: 'Dropdown', key: 'main', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Supporter:', comp: 'Dropdown', key: 'support', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Begin At:', comp: 'NewCalendar', key: 'start', showTime: false, disable: true },
        { label: 'End At:', comp: 'NewCalendar', key: 'end', showTime: false },
        { label: 'Type:', comp: 'MultiSelect', key: 'type', options: ['Serial', 'Parallel', 'Pausable', 'Cancelable', 'Holdable'], placeholder: 'Select Types' },
      ],
    }
  },
  methods: {
    currentStep() {},
    previousStep() {
      this.current = this.previous
      this.process = this.processes[this.current]
      this.next = this.process.next
      this.previous = this.process.previous
    },
    nextStep() {
      this.current = this.next
      const nextStartTime = this.process.end
      this.process = this.processes[this.current]
      this.process.start = nextStartTime
      randomProcess(this.process, this.process.start)
      this.next = this.process.next
      this.previous = this.process.previous
    },
    confirm() {},
  },
  computed: {
    disabled() {
      return this.labels.some(label => !this.process[label.key] || (Array.isArray(this.process[label.key]) && !this.process[label.key].length))
    },
  },
  created() {
    this.processes = { ...{}, ...this.$store.state.processes.find(pro => pro._id === this.cp.process).process }
    console.log('this.processes', this.processes)
    this.stepNames = Object.keys(this.processes)
    const len = this.stepNames.length
    for (let i = 0; i < len; ++i) {
      const name = this.stepNames[i]
      if (this.processes[name].level === 0) {
        this.process = this.processes[name]
        this.process.start = new Date(this.cp.createdAt)
        randomProcess(this.process, this.process.start)
        this.current = name
        this.next = this.process.next
        console.log('this.process', this.process)
        break
      }
    }
  },
  beforeDestroy() {},
}
</script>

<style scoped></style>
