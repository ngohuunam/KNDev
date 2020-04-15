<template>
  <div id="app">
    <Loading v-if="isLoading" />
    <div v-else>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <keep-alive><router-view /></keep-alive>
    </div>
    <NewToast @close="toastClose" />
    <!-- <div class="version">V0.132</div> -->
  </div>
</template>

<script>
import Loading from './components/Loading.vue'

export default {
  name: 'App',
  components: { Loading },
  data: () => ({}),
  mounted: function() {
    // const info = window.localStorage.getItem('info')
    // this.$store.commit('setState', { state: 'user', value: JSON.parse(info) })
  },
  methods: {
    toastClose(detail) {
      this.$store.commit('filterToasts', detail)
    },
  },
  watch: {
    'toasts.length': function(newLen, oldLen) {
      if (newLen > oldLen) this.$toast.add(this.toasts[newLen - 1])
    },
  },
  computed: {
    toasts() {
      return this.$store.state.toasts
    },
    isLoading() {
      return this.$store.state.loading
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
