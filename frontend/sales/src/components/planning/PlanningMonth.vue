<template>
  <div class="p-grid">
    <div class="p-col-4">
      <NewDataTable v-if="table.length" :value="table" :selection.sync="selected" :filters="filters" :scrollable="false">
        <NewColumn field="label" header="Processes">
          <template #filter>
            <InputText type="text" v-model="filters['label']" class="p-column-filter" />
          </template>
          <template #body="{data: {label, processes}}">
            <NewAccordion>
              <AccordionTab :active.sync="active[label]" :header="label">
                <ProcessStatus v-for="process in processes" :key="process._rev" :_id="process._id" />
              </AccordionTab>
            </NewAccordion>
          </template>
        </NewColumn>
      </NewDataTable>
      <!-- <NewListbox v-if="list.length" optionLabel="label" v-model="selected" :options="list" style="width:100%">
        <template #option="{option: process}">
          <ProcessStatus :_id="process._id" />
        </template>
      </NewListbox>
      <div v-else>
        <div class="text-center">Loading records...</div>
        <ProgressBar mode="indeterminate" />
      </div> -->
    </div>
    <div class="p-col">
      <DataTable :value="values">
        <Column field="group" header="Group" headerStyle="width: 200px" bodyStyle="padding: 0; text-align: left;"></Column>
        <Column field="rows" :columnKey="i" v-for="(day, i) of days" :key="i" :header="day.getDate()" bodyClass="table-tree-table" headerStyle="text-align: left;">
          <template #body="slotProps">
            <div :style="`padding: 0.85em 0.857em;${isInDay(slotProps, day)}`" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import ProcessStatus from './ProcessStatus'

export default {
  name: 'PlanningMonth',
  components: { ProcessStatus },
  data() {
    return {
      expandedRowGroups: null,
      active: {},
      filters: {},
      days: [],
      month: 0,
      year: 0,
    }
  },
  methods: {
    isInDay(slotProps, day) {
      // console.log(slotProps)
      let style = ''
      const cellTime = day.getTime()
      const { rows } = slotProps.data
      const len = rows.length
      for (let i = 0; i < len; ++i) {
        const proc = rows[i]
        if (cellTime >= proc.start && cellTime <= proc.end) return (style = ` background-color: ${proc.color.value};`)
      }
      return style
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
      this.days.push(new Date(this.year, this.month - 1, i))
      ++i
    }
  },
  watch: {},
  computed: {
    table() {
      return Object.entries(this.group).map(([group, processes]) => ({ group, label: processes[0].groupLabel, processes }))
    },
    values() {
      return this.$store.getters['operation/process/tableValues']
    },
    group() {
      // return groupBy(this.list, 'group')
      return this.$store.getters['operation/process/group']
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
