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
      this.$store.dispatch('order/film/Worker', { name: 'insert', payload: { ...this.$store.state.order.film.converted } })
    },
  },
  computed: {
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
