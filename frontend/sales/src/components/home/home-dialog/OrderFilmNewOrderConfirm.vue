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
      this.$store.dispatch('order/film/Worker', { name: 'insert', payload: this.converted })
      this.$store.dispatch('operation/plan/inserts', this.converted)
      this.$store.dispatch('prod/film/inserts', this.converted)
    },
  },
  computed: {
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
