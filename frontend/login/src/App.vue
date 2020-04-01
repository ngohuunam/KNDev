<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <HelloWorld v-else />
    <div class="version">V.120</div>
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
    count: 0,
  }),
  methods: {
    handleState() {
      if (this.info) {
        const info = JSON.parse(this.info)
        console.log(info)
        if (info.token) {
          const url = `${window.location.origin}/${info.dept}/${info.page}/${info.token}`
          fetch(url, { method: 'get' }).then(res => {
            if (res.status === 200) {
              window.location.href = url
            } else this.count++
          })
        } else this.isLoading = false
      } else this.isLoading = false
    },
  },
  watch: {
    count(value) {
      if (value < 4) this.handleState()
      else {
        window.localStorage.removeItem('info')
        this.isLoading = false
        setTimeout(() => (this.$children[0].msg = 'Expired, re-login'), 500)
      }
    },
  },
  mounted() {
    this.handleState()
  },
}
</script>

<style></style>
