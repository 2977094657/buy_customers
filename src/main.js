import { createApp } from 'vue'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/router' // 导入你的路由实例
import ImagePreview from 'vue3-image-preview' // 导入 vue3-image-preview 组件

const app = createApp(App)
app.use(router) // 使用你的路由实例
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component('image-preview', ImagePreview) // 全局注册 vue3-image-preview 组件

app.mount('#app') // 在这里挂载你的应用
