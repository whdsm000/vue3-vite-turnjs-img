import path, { resolve } from 'node:path'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

import VitePluginCertificate from 'vite-plugin-mkcert'
import UnoCSS from 'unocss/vite'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'), // 可以自定义文件生成的位置，默认是根目录下
      imports: [
        'vue',
   
        '@vueuse/core',
        '@vueuse/head',
   
      ],
    }),
 

    vue(),
    VitePluginCertificate({
      source: 'coding',
    }) as PluginOption,
    UnoCSS(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 本地运行配置，及反向代理配置
  server: {
    host: '0.0.0.0', // 指定服务器主机名
    port: 3525, // 指定服务器端口
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
    https: false, // 是否开启 https
    cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
    // http://192.168.1.10:8890
    // http://huayunniao.cn:8890
    // http://192.168.0.9:8888
    // http://file.huayunniao.cn
    proxy: {
     
    },
  },
  build: {
 
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        turnpage: resolve(__dirname, 'turnpage.html'),
      },
    },
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      hashPrefix: 'prefix',
    },
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/css/var.less";',
      },
    },
  },
})
