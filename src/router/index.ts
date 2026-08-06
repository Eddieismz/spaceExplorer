import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import Apod from '@/views/ApodsExplorer.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Apod
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
