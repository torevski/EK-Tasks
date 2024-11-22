import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css'

import router from './router';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
app.use(router);
app.use(bootstrap);
app.mount('#app');


