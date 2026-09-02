import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import Apod from '@/views/ApodsExplorer.vue'
import Gallery from "@/views/gallery.vue";
import ApodDetailsView from "@/views/apodDetailsView.vue";


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
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  },
  {
    path: '/apod/:date',
    name: 'apod-detail',
    component: ApodDetailsView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
