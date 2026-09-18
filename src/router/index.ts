import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import Apod from '@/views/ApodsExplorer.vue'
import Gallery from "@/views/gallery.vue";
import ApodDetailsView from "@/views/apodDetailsView.vue";
import MarsRoverSelectView from "@/views/MarsRoverSelectView.vue";
import MarsRoverGalleryView from "@/views/MarsRoverGalleryView.vue";


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
  },
  {
    path: '/mars-rover',
    name: 'mars-rover',
    component: MarsRoverSelectView
  },
  {
    path: '/mars-rover/:rover',
    name: 'mars-rover-gallery',
    component: MarsRoverGalleryView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
