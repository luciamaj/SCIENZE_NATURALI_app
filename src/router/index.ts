import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Wave from '@/views/WaveB.vue'
//import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  
  {
    path: '/',
    name: 'wave',
    component: Wave,
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
  { path: "/scheda/:id", redirect:'/audio/:id' },
  {
    path: '/scarica/:lang',
    name: 'scarica',
    component: () => import('@/views/Scaricamento.vue')
  },
  {
    path: '/waveB',
    name: 'waveB',
    component: () => import('@/views/Wave.vue')
  },
  {
    path: '/waveAW',
    name: 'waveAW',
    component: () => import('@/views/WaveBAudioWorklet.vue')
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
    component: () => import('@/views/Amplitude.vue')
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
    path: '/testjava',
    name: 'testJava',
    component: () => import('@/views/SimplePage.vue')
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
    console.log("pubblication Null")
    //next();
    console.log("parmas?", to.params.id)
    if(to.params.id){
     localStorage.setItem('provToOpen', to.params.id.toString());
    }
   return next('/onboard');
        
   
  } else {
    return  next();
    
  }
});

export default router
