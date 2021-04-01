import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import './assets/fonts/iconfont.css'


Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
