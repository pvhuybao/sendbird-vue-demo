<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Login</router-link> |
      <router-link to="/chat">Chat</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>