import Vue from 'vue'
import Vuex from 'vuex'


const store = new Vuex.Store({
    state: {
        dataSchede: "",
        currentLang: "it",
        
       
    },
    mutations: {
        dataSchede(state, data) {
            state.dataSchede = data;
        },
        currentLangSet(state, lang) {
            state.currentLang = lang;
        },
        
    },
    getters: {
        dataSchede: state => state.dataSchede,
        currentLang: state => state.currentLang,
    }
});



 

 
export default store;
