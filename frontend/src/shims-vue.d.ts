// 声明 .vue 文件
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 @/components 模块
declare module '@/components' {
  import { Plugin } from 'vue'
  const plugin: Plugin
  export default plugin
}
