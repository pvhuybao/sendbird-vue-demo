import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    channelUrl: null,
    channel: null
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getChannelUrl(state) {
      return state.channelUrl;
    },
    getChannel(state) {
      return state.channel;
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_CHANNEL_URL: (state, channelUrl) => {
      state.channelUrl = channelUrl;
    },
    SET_CHANNEL: (state, channel) => {
      state.channel = channel;
    }
  },
  actions: {
  },
  modules: {
  }
})
