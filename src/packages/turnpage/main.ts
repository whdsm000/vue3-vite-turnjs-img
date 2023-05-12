import { createApp } from 'vue'
import '@/assets/css/index.less'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import 'virtual:uno.css'

const head = createHead()
createApp(App).use(head).mount('#app')
