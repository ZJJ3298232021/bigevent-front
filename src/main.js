import './assets/main.scss'
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-persistedstate-plugin';
import locale from 'element-plus/dist/locale/zh-cn.js'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';



const pinia = createPinia()
const persist = createPersistedState()
const app = createApp(App);
pinia.use(persist)
app.use(router)
app.use(pinia)
app.use(Antd)
app.use(ElementPlus,{locale});
app.mount("#app");