import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/scanner/',
    name: 'scanner',
    component: () => import('@/views/Scanner.vue')
  },
  {
    path: '/audioguida/:id',
    name: 'audioguida',
    component: () => import('@/views/BandCamp.vue')
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/BandCamp.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/MediaPlayer.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
