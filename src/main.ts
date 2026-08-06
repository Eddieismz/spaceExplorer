import { createApp } from 'vue' //get vue engine
import { createPinia } from 'pinia' //Pinia store manager
import './assets/main.css' //apply tailwind stylling globally

import App from './App.vue' // main UI component
import router from './router' // router

const app = createApp(App) // create app using App.vue as root

app.use(createPinia()) //plug pinia
app.use(router) //plug router into vue

app.mount('#app') //inject vue app into html
