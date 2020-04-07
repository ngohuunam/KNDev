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
      this.$store.dispatch('OrderFilm/newProdSave')
    },
  },
  computed: {
    value() {
      return this.$store.getters['OrderFilm/newProdConfirmTableProperties']
    },
    newProdLabels() {
      return this.$store.state.filmOrdersList.newProdLabels
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('OrderFilm/setState', { state: 'newProdConverted', value: null })
  },
}
</script>

<style scoped></style>
