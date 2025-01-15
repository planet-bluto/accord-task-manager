import "./arrayLib.js"

import "./extends/array"
import "./extends/date"
import "./extends/print"
import "./extends/epoch"

import PrimeVue from 'primevue/config';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import "./database"
import "./classTest"
import "./notificationTest"
import "./interval"
import "./reminders"
import "./test"


const app = createApp(App)
app.use(PrimeVue, { unstyled: true })
app.mount('#app')