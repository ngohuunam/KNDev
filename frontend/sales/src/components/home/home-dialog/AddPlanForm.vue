<template>
  <div style="text-align: left;">
    <div class="p-grid p-fluid margin-top margin-bot" style="text-align: center;">
      <div class="p-col">Previous: {{ previous.toUpperCase() }} Current step: {{ current.toUpperCase() }} Next: {{ next.toUpperCase() }}</div>
    </div>
    <div class="p-grid p-fluid" v-for="({ label, comp, key, options, showTime }, i) in labels" :key="i">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ label }}</label>
      </div>
      <div class="p-col-8"><component :is="comp" :key="next" v-model="step[key]" :options="options" :showTime="showTime" /></div>
    </div>
    <div class="p-grid p-fluid">
      <div class="p-col">
        <Button v-if="previous" :label="previous.toUpperCase()" icon="pi pi-caret-left" @click="previousStep" class="p-button-success" />
      </div>
      <div class="p-col">
        <Button :label="current.toUpperCase()" icon="pi pi-caret-up" @click="currentStep" class="p-button-success" />
      </div>
      <div class="p-col">
        <Button :label="next.toUpperCase()" icon="pi pi-caret-right" @click="nextStep" class="p-button-success" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPlanForm',
  components: {},
  props: ['cp'],
  data() {
    return {
      process: null,
      stepNames: [],
      step: null,
      current: '',
      next: '',
      previous: '',
      labels: [
        { label: 'Source:', comp: 'InputText', key: 'source' },
        { label: 'Target:', comp: 'InputText', key: 'target' },
        { label: 'Description:', comp: 'InputText', key: 'description' },
        { label: 'Main Response:', comp: 'Dropdown', key: 'main', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Supporter:', comp: 'Dropdown', key: 'support', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Begin At:', comp: 'NewCalendar', key: 'start', showTime: true },
        { label: 'End At:', comp: 'NewCalendar', key: 'end', showTime: true },
        { label: 'Type:', comp: 'MultiSelect', key: 'type', options: ['Serial', 'Pausable', 'Parallel', 'Cancelable', 'Holdable'], placeholder: 'Select Types' },
      ],
    }
  },
  methods: {
    currentStep() {},
    previousStep() {
      this.current = this.previous
      this.step = this.process[this.current]
      this.next = this.step.next
      this.previous = this.step.previous
    },
    nextStep() {
      this.current = this.next
      this.step = this.process[this.current]
      this.next = this.step.next
      this.previous = this.step.previous
    },
    confirm() {},
  },
  computed: {
    disabled() {
      return this.labels.some(label => !this.step[label.key] || (Array.isArray(this.step[label.key]) && !this.step[label.key].length))
    },
  },
  created() {
    this.process = { ...{}, ...this.$store.state.processes.find(pro => pro._id === this.cp.process).process }
    console.log('this.process', this.process)
    this.stepNames = Object.keys(this.process)
    const len = this.stepNames.length
    for (let i = 0; i < len; ++i) {
      const name = this.stepNames[i]
      if (this.process[name].level === 0) {
        this.step = this.process[name]
        this.current = name
        this.next = this.step.next
        console.log('this.step', this.step)
        break
      }
    }
  },
  beforeDestroy() {},
}
</script>

<style scoped></style>
