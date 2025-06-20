import '@/app/main.css'

import { router } from '@/app/router'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#app')
