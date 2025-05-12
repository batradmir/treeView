<script setup lang="ts">
import { computed } from 'vue'
import type { IconName } from '@/components/base-icon/types.ts'

const { name = 'star', size = 16 } = defineProps<{
  name?: IconName
  size?: number
}>()

const pathsMap: Partial<Record<IconName, string>> = {
  star: 'icons/star.svg',
  calendar: 'icons/calendar.svg',
  settings: 'icons/settings.svg',
  home: 'icons/home.svg',
  calendarPlus: 'icons/calendar-plus.svg',
  box: 'icons/box.svg',
  arrow: 'icons/arrow.svg',
}

const iconPath = computed(() => pathsMap[name]! ?? null)
const iconSize = computed(() => `${size}px`)
</script>
<template>
  <div v-if="iconPath" class="base-icon">
    <inline-svg :src="iconPath" />
  </div>
</template>
<style scoped>
.base-icon {
  display: flex;
  align-items: center;

  &:deep(svg) {
    height: v-bind(iconSize) !important;
    width: v-bind(iconSize) !important;
  }
}
</style>
