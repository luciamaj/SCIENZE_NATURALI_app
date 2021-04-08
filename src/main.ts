import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import LoadScript from "vue-plugin-load-script";

import { IonicVue } from '@ionic/vue';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import VuePlyr from "vue-plyr";
import "vue-plyr/dist/vue-plyr.css";

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
import './registerServiceWorker'

/* Theme variables */
import './theme/variables.css';

import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import store from './store'

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


const iconsObject = Object.assign({}, ...currentIcons);
addIcons(iconsObject);

const app = createApp(App).use(store)
  .use(IonicVue)
  .use(router)
  .use(LoadScript)
  .use(VuePlyr, {
    plyr: {}
  });

router.isReady().then(() => {
  app.mount('#app');
});

defineCustomElements(window);