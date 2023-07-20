import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {AntDesignVueResolver, ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
          ElementPlusResolver(),
        AntDesignVueResolver({
        importStyle: false, // css in js
      })
      ],
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    host:'0.0.0.0'
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "element-plus/lib/theme-chalk/index.scss";`
      }
    }
  }
})
