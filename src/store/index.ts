import { createStore } from 'vuex'

export default createStore({
  state: {
    data: [],
  },
  mutations: {
    dataSet(state, data) {
      state.data = data;
  },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    data: state => state.data,  //ritorna tutte 
  }
})
