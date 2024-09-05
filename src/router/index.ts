import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import WaveApp from '@/views/WavetoApp.vue'
import Wave from '@/views/WaveB.vue'
import store from '../store/store'
import common from '../js/common'
//import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/',
    name: 'wave',
    component: WaveApp,
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('pubblication')==null) {
        next('/onboard');
        
        return;
      } else {
        next();
        return;
      }
    }
  },
  { path: "/:pathMatch(.*)*", redirect: '/' },
  {
    path:"/scheda/:id",
    name:"scheda",
    component: '',
    beforeEnter: (to, from, next) => {
      if(store.getters.conf.interactionMode=='mix'){
      
        next({name:'open-app', params:{tag:to.params.id}});
       
        return;
      }else{
        const data=localStorage.getItem("dataMostra")
        let scheda= JSON.parse(data).find(x => x.tag == to.params.id );
        const lang= localStorage.getItem("lang");
            
        scheda= scheda.content.find(x => x.lang == lang);
        if(scheda.type=="video"){
          next ( '/video/'+to.params.id )
        }else {
          next('/audio/'+to.params.id );
          return;
        }

      }
      
    },
    
  },
  
  {
    path: '/scarica',
    name: 'scarica',
    component: () => import('@/views/Scaricamento.vue'),
    props: true
  },
  {
    path: '/waveApp',
    name: 'waveApp',
    component: Wave
  },
  {
    path: '/gps',
    name: 'gps',
    component: () => import('@/views/Map.vue')
  },
  
  {
    path: '/onboard',
    name: 'onboard',
    component: () => import('@/views/Onboardv3.vue')
  },
  {
    path: '/subs/:lang/:timestamp/:videoParam/',
    name: '',
    component: () => import('@/views/SubtitlesIOS.vue')
  },
  {
    path: '/scanner/',
    name: 'scanner',
    component: () => import('@/views/Scanner.vue')
  },
  {
    path: '/audio/:id',
    name: 'audio',
    component: () => import('@/views/Amplitude.vue'),
    beforeEnter: (to, from, next) => {
    
        next();
        next(from)

    },
  },
  {
    path: '/audiosync/:id/:timestamp',
    name: 'audio-sync',
    component: () => import('@/views/AmplitudeSync.vue'),
      
  },
  {
    path: '/open-scanner/',
    name: 'open-scanner',
    component: () => import('@/views/OpenScanner.vue'),
  },
  {
    path: '/video/:id/:timestamp?',
    name: 'video',
    component: () => import('@/views/Video.vue')
  },
  {
    path: '/soloImg/:id',
    name: 'solo-image',
    component: () => import('@/views/SoloImage.vue'),
      
  },
  {
    path: '/openapp',
    name: 'open-app',
    component: () => import('@/views/SimplePage.vue'),
    props:true
  },
  {
    path: '/raccolta',
    name: 'raccolta',
    component: () => import('@/views/Visited.vue'),
    props:true
  },
  {
    path: '/testsw',
    name: 'swt',
    component: () => import('@/views/testsw.vue'),
  },


  
 /* {
    path: '/test',
    name: 'test',
    component: () => import('@/views/Testmicvue.vue')
  },*/
 /* {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/welcome'
      },
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/Welcome.vue')
      },
      {
        path: 'open-scanner',
        name: 'open-scanner',
        component: () => import('@/views/OpenScanner.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Wave.vue'),
      }
    ]
  }*/
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('pubblication')==null && to.path !== '/onboard') {
    if((to.name == 'scheda'||to.name == 'open-app' ) && store.getters.conf.interactionMode=='mix'){
      return  next();
    }else{
      console.log("pubblication Null")
      //next();
      console.log("parmas?", to.params.id)
      if(to.params.id){
      localStorage.setItem('provToOpen', to.params.id.toString());
      }
      return next('/onboard');
 
    }
    
   
  } else if(localStorage.getItem('pubblication')!=null){
   
    const confsaved=JSON.parse(localStorage.getItem("pubblication"))
    const releaseNew=parseInt(store.getters.pubblication.config.app_release)
    const savedRelease=(confsaved && confsaved.config)?parseInt(confsaved.config.app_release):null
   // console.log(releaseNew+" - "+savedRelease);
    if((releaseNew>savedRelease || savedRelease==null)){
        navigator.serviceWorker.controller.postMessage({type:'addversion'});
        common.deleteDB().then(()=>{ console.log("DB deleted!!")})
        localStorage.clear();
       return next('/onboard');
    } else{
      return  next();
    }    
   
    
  } else {
    return  next();
  
  }
});

export default router
