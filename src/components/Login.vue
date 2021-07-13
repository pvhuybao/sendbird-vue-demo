<template>
  <div>
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Login</h1>
    <div>
      <span>Username </span>
      <input v-model="username" type="text" v-on:keyup.enter="login">
      <button class="login-btn" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import { connect } from '@/sendbird.js';

export default {
  data() {
    return {
      username: '',
    }
  },

  methods: {
    async login() {
      let user = await connect(this.username);
      if(!user) return;

      await this.$store.commit('SET_USER', user);
      this.$router.push('/chat');
    }
  }
}
</script>

<style lang="scss" scoped>
.login-btn {
  margin-left: 10px;
}
</style>
