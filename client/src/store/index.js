import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticated: false,
  },
  mutations: {
    authentication(state, set) {
      state.authenticated = set;
    },
  },
});
