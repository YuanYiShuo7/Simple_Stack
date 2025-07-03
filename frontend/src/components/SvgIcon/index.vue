<!-- src/components/Icon.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{
  name: string           // svg文件名，不带扩展名
  size?: string | number // 尺寸，默认1em
  color?: string         // 填充颜色，默认继承
  iconClass?: string         // 自定义样式类
}>()

const iconComponent = computed(() => {
  return defineAsyncComponent(() =>
    import(`@/assets/icons/${props.name}.svg`)
  )
})

const style = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size || '1em',
  height: typeof props.size === 'number' ? `${props.size}px` : props.size || '1em',
  fill: props.color || 'currentColor',
}))
</script>

<template>
  <component :is="iconComponent" :style="style" :class="iconClass" />
</template>

<style scoped>
/* 可添加一些默认行为 */
</style>

