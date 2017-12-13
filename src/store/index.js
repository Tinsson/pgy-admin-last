import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex);

const state = {
  username: '',
  currentpath: '',
  authView: [],
  firstview: ''
};

const getters = {
  permission: state => {
    return state.authView;
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
