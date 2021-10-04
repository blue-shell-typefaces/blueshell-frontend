import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'

Vue.config.productionTip = false
axios.get(`${process.env.VUE_APP_API_URL}/static/data.json`)
  .then(function ({data}) {
    Vue.prototype.$fonts = data
  })
  .catch(function () {
    // todo error
  })

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
