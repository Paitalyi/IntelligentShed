
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

const app = createApp(App)
// app.use(ElementPlus)
app.mount('#app')
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif