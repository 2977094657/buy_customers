import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Price } from '@nutui/nutui'
import Antd from 'ant-design-vue';
import Vant from "vant"
import 'vant/lib/index.css';
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {router} from './router/router' // 导入你的路由实例
import ImagePreview from 'vue3-image-preview' // 导入 vue3-image-preview 组件
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';



dayjs.locale('zh-cn'); // 设置 dayjs 的全局 locale 为中文
const app = createApp(App)
app.use(router)
app.use(Vant);
app.use(Antd)
app.use(createPinia())
app.use(Price)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component('image-preview', ImagePreview) // 全局注册 vue3-image-preview 组件

app.mount('#app') // 在这里挂载你的应用
