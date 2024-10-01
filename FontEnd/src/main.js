import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // สำหรับ JavaScript ของ Bootstrap
import './validate';

import Swal from 'sweetalert2';
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
