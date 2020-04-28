<template>
  <div class="p-grid">
    <div class="p-col-2">
      <Listbox v-model="selected" dataKey="_id" :options="list" :multiple="true" :filter="true" listStyle="text-align: left, max-height: 1500px;" style="width:100%">
        <template #option="slotProps">
          <div class="p-clearfix list-item" :style="styles[slotProps.option.status]">
            <span>{{ slotProps.option._id }}</span>
          </div>
        </template>
      </Listbox>
    </div>
    <div class="p-col-10">
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

export default {
  name: 'PlanningMonth',
  data() {
    return {
      days: [],
      month: 0,
      year: 0,
      values: [],
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
    console.log('this.days', this.days)
    this.values = json.root
    console.log('this.values', this.values)
  },
  computed: {
    list() {
      return this.$store.state.operation.plan.list
    },
    selected: {
      get() {
        return this.$store.state.operation.plan.selected
      },
      set(values) {
        this.$store.commit('operation/plan/setState', { key: 'selected', data: values })
      },
    },
  },
}
</script>
