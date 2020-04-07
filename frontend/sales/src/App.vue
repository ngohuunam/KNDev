<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <keep-alive><router-view /></keep-alive>
    <NewToast @close="toastClose" />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
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
