import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import WaveApp from '@/views/WavetoApp.vue'
import Wave from '@/views/WaveB.vue'
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
      if(process.env.VUE_APP_MODE=='mix'){
      
        next({name:'open-app', params:{tag:to.params.id}});
       // window.location.replace('intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end');
        //window.location.replace('instagram');
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
    path: '/scarica/:lang',
    name: 'scarica',
    component: () => import('@/views/Scaricamento.vue')
  },
  {
    path: '/waveApp',
    name: 'waveApp',
    component: Wave
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
    path: '/open-scanner/',
    name: 'open-scanner',
    component: () => import('@/views/OpenScanner.vue'),
  },
  {
    path: '/video/:id',
    name: 'video',
    component: () => import('@/views/Video.vue')
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
    if((to.name == 'scheda'||to.name == 'open-app' ) && process.env.VUE_APP_MODE=='mix'){
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
    
   
    } else {
      return  next();
    
    }
});

export default router
