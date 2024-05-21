import Vue from 'vue'
import Vuex from 'vuex'


const store = new Vuex.Store({
    state: {
        dataSchede: "",
        currentLang: "it",
        conf: null,
        baseUrl: "",
        pubblication:"",
        percorsosel:""
        
       
    },
    mutations: {
        pubblication(state, data) {
            state.pubblication = data;
        },
        percorsosel(state, data){
            state.percorsosel = data;
        },
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
        pubblication: state => state.pubblication,
        percorsosel: state => state.percorsosel,
        dataSchede: state => state.dataSchede,
        currentLang: state => state.currentLang,
        conf: state => state.conf,
        baseUrl: state => state.baseUrl,
    }
});



 

 
export default store;
