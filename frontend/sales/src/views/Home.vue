<template>
  <div class="home">
    <!-- <div class="center"><img alt="Vue logo" src="../assets/logoKN.png" /></div> -->

    <div class="p-grid">
      <div :class="orderFilmColumnClass">
        <OrderFilmColumn @toggle-enlarge="v => (orderFilmColumnEnlarge = v)" :_enlarge="orderFilmColumnEnlarge" @open-dialog="openDialog" />
      </div>
      <div v-if="hasProdFilmTable" :class="prodFilmColumnClass">
        <ProdFilmColumn @toggle-enlarge="v => (prodFilmColumnEnlarge = v)" :_enlarge="prodFilmColumnEnlarge" @open-dialog="openDialog" />
      </div>
    </div>
    <NewDialog
      v-if="dialogComponent"
      :header="dialogHeader"
      :visible.sync="isOpenDialog"
      :style="{ width: dialogWidth }"
      @keyup-enter="dialogConfirm"
      @keyup-escape="closeDialog"
      :modal="true"
      :contentStyle="{ overflow: 'visible' }"
      :closable="false"
      :disableKeyTab="disableKeyTab"
    >
      <BlockUI v-if="dialogComponent" :blocked="loading">
        <component :key="confirmBtnLabel" :is="dialogComponent" :ref="compRef" @switch-comp="openDialog" :cp="compProps" />
        <NewMessage v-if="dialogMess.text" @close-message="closeMessage" :severity="dialogMess.severity">{{ dialogMess.text }}</NewMessage>
      </BlockUI>

      <template #footer>
        <BlockUI v-if="dialogComponent" :blocked="loading">
          <!-- <Button v-if="confirmBtnLabel === 'Create'" label="Force Create" icon="pi pi-angle-double-up" @click="forceCreate" /> -->
          <Button v-if="confirmBtnLabel === 'Save'" label="Back" icon="pi pi-angle-double-left" @click="backDialog" />
          <Button :label="confirmBtnLabel" :icon="buttonIcon" @click="dialogConfirm" class="p-button-success" />
          <Button label="Cancel" icon="pi pi-times" @click="closeDialog" class="p-button-danger" />
        </BlockUI>
      </template>
    </NewDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import OrderFilmColumn from '@/components/home/home-columns/OrderFilmColumn.vue'
import ProdFilmColumn from '@/components/home/home-columns/ProdFilmColumn.vue'
import OrderFilmDeleteConfirm from '@/components/home/home-dialog/OrderFilmDeleteConfirm.vue'
import OrderFilmNewOrderForm from '@/components/home/home-dialog/OrderFilmNewOrderForm.vue'
import OrderFilmNewOrderConfirm from '@/components/home/home-dialog/OrderFilmNewOrderConfirm.vue'
import OrderFilmNewOrderSForm from '@/components/home/home-dialog/OrderFilmNewOrderSForm.vue'
import OrderFilmNewProdForm from '@/components/home/home-dialog/OrderFilmNewProdForm.vue'
import OrderFilmNewProdConfirm from '@/components/home/home-dialog/OrderFilmNewProdConfirm.vue'
import AddPlanForm from '@/components/home/home-dialog/AddPlanForm.vue'

export default {
  name: 'Home',
  components: {
    OrderFilmColumn,
    ProdFilmColumn,
    deleteConfirm: OrderFilmDeleteConfirm,
    newOrderForm: OrderFilmNewOrderForm,
    newOrderConfirm: OrderFilmNewOrderConfirm,
    newOrdersForm: OrderFilmNewOrderSForm,
    newProdForm: OrderFilmNewProdForm,
    newProdConfirm: OrderFilmNewProdConfirm,
    addPlanForm: AddPlanForm,
  },
  data: () => ({
    dialogComponent: null,
    orderFilmColumnEnlarge: true,
    prodFilmColumnEnlarge: true,
    jobColumnEnlarge: true,
    confirmBtnLabel: '',
    dialogHeader: '',
    compRef: '',
    compProps: null,
    dialogWidth: '400px',
    disableKeyTab: false,
  }),
  mounted: function() {
    // this.$store.dispatch('auth')
  },
  methods: {
    unblock() {},
    closeMessage() {
      this.dialogMess = { text: '', severity: '' }
    },
    backDialog() {
      if (this.compRef.includes('ProdConfirm')) this.openDialog('newProdForm', 'Create', 'Add new Product', this.compProps)
      else this.openDialog('newOrderForm', 'Create', 'Add new film')
    },
    openDialog(comp, label, header, props, width, disableKeyTab) {
      console.log(comp)
      this.compProps = props
      this.disableKeyTab = disableKeyTab
      this.dialogWidth = width || '400px'
      this.compRef = comp
      this.confirmBtnLabel = label
      this.dialogHeader = header
      this.dialogComponent = this.$options.components[comp]
      this.isOpenDialog = true
    },
    closeDialog() {
      // setTimeout(() => {
      //   this.dialogComponent = null
      // }, 500)
      this.isOpenDialog = false
      this.dialogMess = { text: '', severity: '' }
    },
    dialogConfirm(e) {
      // console.log(e)
      if (e.target.type !== 'textarea' && e.target.className !== 'ql-editor') this.$refs[this.compRef].confirm()
    },
    forceCreate() {
      this.$refs[this.compRef].doCreate()
    },
    toggleOrderFilmColumnEnlarge(v) {
      this.orderFilmColumnEnlarge = v
    },
    toggleProdFilmColumnEnlarge() {
      this.prodFilmColumnEnlarge = !this.prodFilmColumnEnlarge
    },
    toggleJobColumnEnlarge() {
      this.jobColumnEnlarge = !this.jobColumnEnlarge
    },
  },
  watch: {
    isOpenDialog: function(value) {
      if (value === false) {
        setTimeout(() => {
          this.dialogComponent = ''
        }, 500)
      }
    },
  },
  computed: {
    hasProdFilmTable() {
      return this.$store.state.prod.film.list.length > 0
      // return false
    },
    isOpenDialog: {
      get() {
        return this.$store.state.dialog.isOpen
      },
      set(value) {
        this.$store.commit('dialog/setState', { key: 'isOpen', data: value })
      },
    },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
    buttonIcon() {
      return this.loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'
    },
    loading() {
      return this.$store.state.dialog.loading
    },
    orderFilmColumnClass: function() {
      return this.orderFilmColumnEnlarge ? 'p-col-12' : 'p-col-2'
    },
    prodFilmColumnClass: function() {
      return this.prodFilmColumnEnlarge ? (this.orderFilmColumnEnlarge ? 'p-col-12' : 'p-col-10') : 'p-col-2'
    },
    jobColumnClass: function() {
      return this.jobColumnEnlarge ? 'p-col-3' : 'p-col-1'
    },
  },
}
</script>

<style>
.center {
  width: 100%;
  text-align: center;
  padding: 0 0 24px 0;
}
</style>
