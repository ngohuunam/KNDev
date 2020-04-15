<template>
  <DataTable :value="value" data-key="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
export default {
  name: 'OrderFilmNewProdConfirm',
  components: {},
  data: () => ({}),
  methods: {
    confirm() {
      this.$store.dispatch('Order/Film/Worker', { name: 'newProd', payload: this.converted })
      this.$store.dispatch('Prod/Film/Worker', { name: 'newItem', payload: this.converted })
    },
  },
  computed: {
    converted() {
      return this.$store.state.Prod.Film.converted
    },
    value() {
      return this.$store.getters['Prod/Film/newProdConfirmTableProperties'](this.converted)
    },
    newProdLabels() {
      return this.$store.state.Order.Film.newProdLabels
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('Prod/Film/setState', { key: 'converted', data: null })
  },
}
</script>

<style scoped></style>
