<template>
  <DataTable :value="value" dataKey="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
export default {
  name: 'OrderFilmNewOrderConfirm',
  components: {},
  data: () => ({}),
  methods: {
    confirm() {
      // this.$store.dispatch('Order/Film/newOrder')
      this.$store.dispatch('Order/Film/Worker', { name: 'newOrder', payload: { ...this.$store.state.Order.Film.newOrderConverted } })
    },
  },
  computed: {
    value() {
      return this.$store.getters['Order/Film/newOrderConfirmTableProperties']
    },
    newOrderLabels() {
      return this.$store.state.Order.Film.newOrderLabels
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('Order/Film/setState', { key: 'newOrderConverted', data: null })
  },
}
</script>

<style scoped></style>
