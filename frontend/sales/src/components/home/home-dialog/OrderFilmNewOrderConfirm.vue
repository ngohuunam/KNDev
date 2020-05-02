<template>
  <DataTable :value="value" dataKey="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
import { opts, dbName as db } from '../../../store/modules/order/options'

export default {
  name: 'OrderFilmNewOrderConfirm',
  components: {},
  // data: () => ({}),
  methods: {
    confirm() {
      this.$store.dispatch('order/film/Worker', { name: 'insert', payload: this.converted })
      if (this.converted.processes.length)
        this.$store.dispatch('operation/process/inserts', {
          source: this.converted,
          year: this.year,
          db,
          col: opts.film.colName,
          label: `${this.converted.foreignTitle} >>> `,
          groupLabel: this.converted.foreignTitle,
        })
      if (this.converted.products.length) this.$store.dispatch('prod/film/inserts', this.converted)
    },
  },
  computed: {
    year() {
      return this.$store.state.year
    },
    converted() {
      return this.$store.state.order.film.converted
    },
    value() {
      return this.$store.getters['order/film/newOrderConfirmTableProperties']
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('order/film/setStates', { keys: ['converted', 'loading'], datas: [null, false] })
  },
}
</script>

<style scoped></style>
