<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <HelloWorld v-else />
    <div class="version">V.112</div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Loading from './components/Loading.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Loading,
  },
  data: () => ({
    isLoading: true,
    info: window.localStorage.getItem('info'),
    serverCmd: 'this place for cmd',
  }),
  methods: {
    handleState() {
      const localInfo = window.localStorage.getItem('info')
      console.log(localInfo)
      if (localInfo) {
        const info = JSON.parse(localInfo)
        if (info.auth && info.token) {
          window.location.href = `${window.location.href}${info.dept}/${info.page}/${info.token}`
          this.info = info
        } else this.isLoading = false
      } else this.isLoading = false
    },
  },
  mounted() {
    if (this.info) {
      const info = JSON.parse(this.info)
      console.log(info)
      if (info.token) {
        window.location.href = `${window.location.href}${info.dept}/${info.page}/${info.token}`
      } else this.isLoading = false
    } else this.isLoading = false
    // this.$nextTick(() => {
    //   setTimeout(() => this.handleState(), 1000)
    // })
  },
}
</script>

<style></style>
