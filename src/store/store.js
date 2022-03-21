import Vue from 'vue'
import Vuex from 'vuex'


const store = new Vuex.Store({
    state: {
        dataSchede: "",
        currentLang: "it",
        conf: null,
        baseUrl: "",
        
       
    },
    mutations: {
        dataSchede(state, data) {
            state.dataSchede = data;
        },
        currentLangSet(state, lang) {
            state.currentLang = lang;
        },
        confSet(state, conf) {
            state.conf = conf
        },
        baseUrlSet(state, baseUrl) {
            state.baseUrl = baseUrl
        },
        
    },
    getters: {
        dataSchede: state => state.dataSchede,
        currentLang: state => state.currentLang,
        conf: state => state.conf,
        baseUrl: state => state.baseUrl,
    }
});



 

 
export default store;
