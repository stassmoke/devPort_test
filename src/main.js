import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'


import './assets/styles/_global.sass';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
