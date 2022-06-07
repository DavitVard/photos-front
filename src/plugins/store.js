import Vue from "vue";
import Vuex from "vuex";
import Cookies from 'js-cookie';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    auth: {check: false, token: null}
  },

  getters: {
    isLogged: state => state.auth.check,
    token: state => state.auth.token
  },

  mutations: {
    setToken: (state, token) => state.auth.token = token,
    setCheck: (state, check) => state.auth.check = check,
  },

  actions: {
    login({commit}, token) {
      commit('setToken', token);
      commit('setCheck', true);
    },
    logout({commit}) {
      commit('setToken', null);
      commit('setCheck', false);
    },
  },

  plugins: [
    createPersistedState({
      paths: ['auth'],
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, v) => Cookies.set(key, v, { expires: 3, secure: false }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ]
});

export default store;
