import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
//import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'wave',
    component: () => import('@/views/WaveB.vue'),
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('version')==null) {
        next('/onboard');
        
        return;
      } else {
        next();
        return;
      }
    }
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
    component: () => import('@/views/Onboardv2.vue')
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

export default router
