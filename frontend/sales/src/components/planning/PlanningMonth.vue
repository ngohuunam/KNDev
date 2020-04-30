<template>
  <div class="p-grid">
    <div class="p-col-3">
      <NewListbox v-if="list.length" v-model="selected" :options="list" style="width:100%">
        <template #option="{option, index}">
          <!-- <div class="p-clearfix list-item" :style="styles[slotProps.option.status]">
            <span>{{ slotProps.option._id }}</span>
          </div> -->
          <NewAccordion>
            <AccordionTab :header="option.label">
              <ProcessInput :proc_id="option._id" :index="index" />
            </AccordionTab>
          </NewAccordion>
        </template>
      </NewListbox>
      <div v-else>
        <div class="text-center">Loading records...</div>
        <ProgressBar mode="indeterminate" />
      </div>
    </div>
    <div class="p-col">
      <TreeTable :value="values">
        <Column field="name" header="Name" :expander="true" headerStyle="width: 100px" bodyStyle="padding: 0; text-align: left;"></Column>
        <Column field="time" :columnKey="day" v-for="day of days" :key="day" :header="day" bodyClass="table-tree-table">
          <template #body="slotProps">
            <div :style="`padding: 0.85em 0.857em;${isInDay(slotProps, day)}`" />
          </template>
        </Column>
      </TreeTable>
    </div>
  </div>
</template>

<script>
import json from '../../utils/json'
import { groupBy } from '../../utils'
import ProcessInput from './ProcessInput'

export default {
  name: 'PlanningMonth',
  components: { ProcessInput },
  data() {
    return {
      days: [],
      month: 0,
      year: 0,
      values: [],
      // procValues: {},
      labels: [
        { label: 'Source:', comp: 'InputText', key: 'source' },
        { label: 'Target:', comp: 'InputText', key: 'target' },
        { label: 'Description:', comp: 'InputText', key: 'description' },
        { label: 'Main Response:', comp: 'Dropdown', key: 'main', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Supporter:', comp: 'Dropdown', key: 'support', options: ['Diễn', 'Hiền', 'Khang', 'Nam', 'Other'] },
        { label: 'Begin At:', comp: 'NewCalendar', key: 'start', showTime: false, disable: false },
        { label: 'End At:', comp: 'NewCalendar', key: 'end', showTime: false },
        { label: 'Type:', comp: 'MultiSelect', key: 'type', options: ['Serial', 'Parallel', 'Pausable', 'Cancelable', 'Holdable'], placeholder: 'Select Types' },
      ],
      options: [
        { field: 'name', header: 'Vin', expander: true },
        { field: 'size', header: 'Size' },
        { field: 'type', header: 'Type' },
      ],
      styles: { Created: 'background-color: #007ad9; color: white' },
    }
  },
  methods: {
    checkDay({ d: sd, m: sm }, { d: ed, m: em }, color, day) {
      return sm <= this.month && em >= this.month && sd <= day && ed >= day ? ` background-color: ${color};` : ''
    },
    isInDay(
      {
        node,
        node: {
          data: { time, color },
          children,
        },
      },
      day,
    ) {
      if (node.root) {
        const len = children.length
        let style
        for (let i = 0; i < len; ++i) {
          const _data = children[i].data
          const {
            time: { start, end },
          } = _data
          style = this.checkDay(start, end, color, day)
          if (style) break
        }
        return style
      }
      const { start, end } = time
      return this.checkDay(start, end, color, day)
    },
    getDaysInMonth: function(month, year) {
      // Here January is 1 based
      //Day 0 is the last day in the previous month
      return new Date(year, month, 0).getDate()
      // Here January is 0 based
      // return new Date(year, month+1, 0).getDate();
    },
  },
  created() {
    this.year = this.$store.state.year
    this.month = this.$store.state.month
    const noOfDays = this.getDaysInMonth(this.month, this.year)
    let i = 1
    while (i <= noOfDays) {
      this.days.push(i)
      ++i
    }
    this.values = json.root
  },
  watch: {},
  computed: {
    group() {
      return groupBy(this.list, 'group')
    },
    list() {
      return this.$store.state.operation.process.list
    },
    selected: {
      get() {
        return this.$store.state.operation.process.selected
      },
      set(values) {
        this.$store.commit('operation/process/setState', { key: 'selected', data: values })
      },
    },
  },
}
</script>
