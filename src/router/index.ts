import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/welcome'
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
    path: '/video/:id',
    name: 'video',
    component: () => import('@/views/Video.vue')
  },
  {
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
