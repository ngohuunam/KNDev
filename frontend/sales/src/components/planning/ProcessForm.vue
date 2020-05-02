<template>
  <div>
    <div class="p-grid p-fluid" v-for="({ label, comp, key, options, minDate, maxDate, disabled }, i) in labels" :key="i">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ label }}</label>
      </div>
      <div class="p-col-8">
        <div style="font-weight: bold" v-if="process.lock">
          {{ process[key] instanceof Date ? $tToString(process[key]) : Array.isArray(process[key]) ? process[key].join(', ') : process[key] }}
        </div>
        <component v-else :is="comp" v-model="process[key]" :disabled="disabled" :options="options" :minDate="minDate" :maxDate="maxDate" />
      </div>
    </div>
    <div class="p-grid p-fluid">
      <div class="p-col-4" style="margin: auto;">
        <label>Color:</label>
      </div>
      <div class="p-col-8">
        <div v-if="process.lock" style="display: flex; font-weight: bold;">
          <div class="p-col-4" :style="'background-color: ' + process.color.value" />
          <span class="p-col">{{ process.color.label }}</span>
        </div>
        <Dropdown v-else v-model="process.color" :options="colors" @before-show="beforeShow" optionLabel="label" filter placeholder="Select a Color" showClear>
          <template #value="slotProps">
            <div style="display: flex" v-if="slotProps.value">
              <div class="p-col-4" :style="'background-color: ' + slotProps.value.value" />
              <span class="p-col">{{ slotProps.value.label }}</span>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div style="display: flex">
              <div class="p-col-4" :style="'background-color: ' + slotProps.option.value" />
              <span class="p-col">{{ slotProps.option.label }}</span>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="p-grid p-fluid">
      <div v-if="!process.lock" class="p-col-2">
        <Button label="Cancel" @click="cancel" class="p-button-danger" :disabled="isEqual(last, process)" />
      </div>
      <div v-if="!process.lock" class="p-col-2">
        <Button label="Clear" @click="clear" class="p-button-warning" :disabled="isEqual(origin, process)" />
      </div>
      <div v-if="!process.lock" class="p-col-2">
        <Button label="Random" @click="random" class="p-button-warning" />
      </div>
      <div v-if="process.status !== 'Started'" class="p-col">
        <Button label="Start" @click="save('Started')" class="p-button-info" :disabled="!isValid" />
      </div>
      <div v-if="!process.lock" class="p-col-2">
        <Button label="Save" @click="save(null)" class="p-button-success" :disabled="isEqual(last, process)" />
      </div>
      <div v-if="!process.lock" class="p-col-2">
        <Button label="Lock" @click="save('Locked, need to start')" class="p-button-success" :disabled="!isValid" />
      </div>
    </div>
  </div>
</template>

<script>
import isEqual from 'lodash.isequal'
import shuffle from 'lodash.shuffle'
import { randomProcess } from '../../utils/dev'
import { isProcessValid, getProcessStatus } from '../../utils'
import colors from '../../utils/colors'

export default {
  name: 'ProcessForm',
  props: ['_process'],
  data() {
    return {
      colors,
      labels: [
        { label: 'Source:', comp: 'InputText', key: 'source' },
        { label: 'Target:', comp: 'InputText', key: 'target' },
        { label: 'Description:', comp: 'InputText', key: 'description' },
        { label: 'Main Response:', comp: 'Dropdown', key: 'main', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Supporter:', comp: 'Dropdown', key: 'support', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Begin At:', comp: 'NewCalendar', key: 'start', disabled: false, minDate: null },
        { label: 'End At:', comp: 'NewCalendar', key: 'end', disabled: true, minDate: null, maxDate: null },
        { label: 'Type:', comp: 'MultiSelect', key: 'types', options: ['Serial', 'Parallel', 'Pausable', 'Cancelable', 'Holdable'] },
      ],
      process: {},
    }
  },
  origin: null,
  last: null,
  methods: {
    isProcessValid,
    isEqual,
    beforeShow() {
      shuffle(this.colors)
    },
    random() {
      randomProcess(this.process)
    },
    clear() {
      this.process = { ...this.origin }
      this.last = { ...this.process }
    },
    cancel() {
      this.process = { ...this.last }
    },
    save(status) {
      if (status) {
        this.process.lock = Date.now()
        this.process.status = status
      } else if (this.isValid) this.process.status = 'Need to start'
      else this.process.status = getProcessStatus(this.process)
      const data = { ...this.process, ...{ start: this.process.start.getTime(), end: this.process.end.getTime() } }
      console.log(data)
      const setObj = Object.entries(data).reduce((pre, [key, value]) => ({ ...pre, ...(isEqual(this._process[key], value) ? {} : { [key]: value }) }), {})
      // setObj.status = getProcessStatus(data)
      delete setObj.logs
      const updateObj = { $set: setObj }
      console.log('updateObj', updateObj)
      this.$store.commit('operation/process/Worker', { name: 'update', payload: { _id: this.process._id, updateObj, note: '' } })
      // this.$store.dispatch('operation/process/save', { index: this.index, data })
      // this.$store.commit('operation/process/replaceAt', { key: 'list', index: this.index, data })
      this.last = { ...this.process }
    },
  },
  watch: {
    'process.start': function(v) {
      const minDate = v
      this.labels[6].minDate = minDate
      const minDateTime = minDate.getTime()
      const maxDateTime = minDateTime + 86400000 * this.process.aot
      const maxDate = new Date(maxDateTime)
      if (this.process.end) {
        const endTime = this.process.end.getTime()
        if (endTime < minDateTime) this.process.end = minDate
        else if (endTime > maxDateTime) this.process.end = maxDate
      } else this.process.end = maxDate
      this.labels[6].maxDate = maxDate
      this.labels[6].disabled = false
    },
  },
  created() {
    this.labels[5].minDate = this.startDate
    this.process = { ...this._process }
    this.process.start = this.process.start ? new Date(this.process.start) : this.startDate
    if (this.process.end) this.process.end = new Date(this.process.end)
    this.origin = { ...this.process }
    this.last = { ...this.process }
  },
  computed: {
    startDate() {
      return this.$store.getters['operation/process/startDate'](this._process)
    },
    isValid() {
      return isProcessValid(this.process)
    },
  },
}
</script>
