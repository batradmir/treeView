<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { generateTree } from '@/components/tree-view/utils.ts'
import TreeView from '@/components/tree-view/TreeView.vue'
import BaseIcon from '@/components/base-icon/BaseIcon.vue'

const nodes = ref(generateTree())

const treeViewRef = useTemplateRef<InstanceType<typeof TreeView>>('tree-view')

const selectedNodes = computed(() => treeViewRef.value?.selectedNodes)
</script>

<template>
  <div>
    <div class="actions">
      <div>Выбранные: {{ selectedNodes }}</div>
      <div class="row">
        <button @click="treeViewRef?.expandAll">Развернуть</button>
        <button @click="treeViewRef?.collapseAll">Свернуть</button>
        <button @click="treeViewRef?.selectAll">Выбрать все</button>
        <button @click="treeViewRef?.clearSelectedAll">Очистить</button>
      </div>
    </div>

    <tree-view ref="tree-view" :nodes="nodes" selectable>
      <!--      Вариант кастомного отображения поля поиска-->
      <!--      <template #search="{ search }">-->
      <!--        <input v-model="search.modelValue" />-->
      <!--      </template>-->

      <!--      Вариант кастомного отображения контента-->
      <!--      <template #label="{ node }">-->
      <!--        <a :href="node.id" class="customEl">-->
      <!--          <base-icon :name="node.icon" />-->
      <!--          {{ node.label }}-->
      <!--        </a>-->
      <!--      </template>-->
    </tree-view>
  </div>
</template>
<style scoped>
.customEl {
  display: flex;
  align-items: center;
  gap: 4px;
}
.actions {
  display: grid;
  gap: 4px;
  margin-bottom: 20px;
}
.row {
  display: flex;
  gap: 4px;
}
</style>
