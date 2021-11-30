import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Detail from './views/Detail.vue'
import './index.css'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'detail', component: Detail },
        // { path: '/:family', name: 'detail', component: Detail }
    ]
})

createApp(App)
    .use(router)
    .mount('#app')
