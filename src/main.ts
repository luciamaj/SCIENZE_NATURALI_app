import { createApp} from 'vue'

import App from './App.vue'
import router from './router';
import store from './store/store';
import i18n from './plugins/i18n';

import { IonicVue } from '@ionic/vue';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import VuePlyr from "vue-plyr";
import "vue-plyr/dist/vue-plyr.css";
//import { conf } from "../config/config";

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import './registerServiceWorker';


/* Theme variables */
import './theme/variables.css';

import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import mitt from 'mitt';
const emitter = mitt();

const currentIcons = Object.keys(allIcons).map(i => {
  const key = i.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  if (typeof allIcons[i] === 'string') {
    return {
      [key]: allIcons[i],
    }
  }
  return {
    ['ios-' + key]: allIcons[i].ios,
    ['md-' + key]: allIcons[i].md,
  };
});
let confvar;
const confurl = "./config/config.json";
let localConf;
let confSwi;

async function fetchlocalconf() {
  const response = await fetch(confurl);
  return  response.json()
}
async function fetchswiconf(url) {
  const response = await fetch(url)
  if(response){
    console.log("RESPONSE")
    return  response.json()
  }
 else{
  console.log("NO RESPONSE, cerco pubblication")
  return JSON.parse(localStorage.getItem('pubblication'))
 }
}

fetchlocalconf().then(configuration=>{
  localConf=configuration;
  fetchswiconf(localConf.baseUrl+"/service/rest/v1/mostra-attiva")
  .then(configswi=>{
    console.log("swiconfig ", configswi.result[0].config)
    confSwi=configswi.result[0].config
    

    const app = createApp(App)
      .use(IonicVue)
      .use(router)
      .use(store)
      .use(i18n)
      .use(VuePlyr, {
        plyr: {}
      });
    
      router.isReady().then(() => {
      app.mount('#app');
    });

    app.config.globalProperties.emitter = emitter;

    app.config.globalProperties.conf=localConf;
    app.config.globalProperties.swiConf=confSwi;
    store.commit("pubblication", configswi.result[0]);
    //console.log("aaa ",localConf.baseUrl);
   
    store.commit("baseUrlSet", localConf.baseUrl);
    store.commit("confSet", localConf);
  
  }).catch(event=>alert(event))
})

/*fetch(confurl)
  .then((response) => response.json())
  .then((configuration) => {
      // Vue.prototype.$config = config
      confvar=configuration;
    console.log(" esiste? ",configuration)
    const app = createApp(App)
      .use(IonicVue)
      .use(router)
      .use(store)
      .use(i18n)
      .use(VuePlyr, {
        plyr: {}
      });
    
      router.isReady().then(() => {
      app.mount('#app');
    });

    app.config.globalProperties.emitter = emitter;

    app.config.globalProperties.conf=configuration;
    console.log("aaa ",configuration.baseUrl);
    store.commit("baseUrlSet", configuration.baseUrl);
    store.commit("confSet", configuration);
    
       
  })*/


const iconsObject = Object.assign({}, ...currentIcons);
addIcons(iconsObject);



defineCustomElements(window);
