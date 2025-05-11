<script setup lang="ts">
import { computed, provide, readonly, ref } from 'vue'
import { areAllKeyUnique, filterTree } from '@/components/tree-view/utils.ts'
import type { TreeNode } from '@/components/tree-view/types.ts'
import TreeNodeItemNew from '@/components/tree-view/TreeNodeItem.vue'
import { useTree } from '@/components/tree-view/useTree.ts'
import { SYMBOL_TREE_VIEW } from '@/components/tree-view/symbol.ts'
import { NODE_KEY } from '@/components/tree-view/types.ts'
import BaseIcon from '@/components/base-icon/BaseIcon.vue'

const { nodes, selectable = false } = defineProps<{
  nodes: TreeNode[]
  selectable?: boolean
}>()

const modelValue = ref('')
const search = ref({
  modelValue,
})

const isTreeCorrect = computed(() => areAllKeyUnique(nodes))

const filteredTree = computed(() => {
  return filterTree(nodes, String(search.value.modelValue))
})

const treeState = useTree(nodes)
provide(SYMBOL_TREE_VIEW, treeState)

const { openedNodes, selectedNodes, expandAll, collapseAll, selectAll, clearSelectedAll } =
  treeState

defineExpose({
  selectedNodes: readonly(selectedNodes),
  expandAll,
  collapseAll,
  selectAll,
  clearSelectedAll,
})
</script>

<template>
  <div class="tree-view" v-if="isTreeCorrect">
    <slot name="search" :search="search">
      <input
        v-model="search.modelValue"
        placeholder="Поиск по названию..."
        type="text"
        class="tree-view__input"
      />
    </slot>

    <div>
      <ul v-if="filteredTree.length" class="tree">
        <tree-node-item-new
          v-for="node in filteredTree"
          :key="node[NODE_KEY]"
          :node="node"
          :open-nodes="openedNodes"
          :selected-nodes="selectedNodes"
          :selectable="selectable"
        >
          <template #label="{ node: slotNode }">
            <slot name="label" :node="slotNode">
              <base-icon :name="slotNode.icon" :size="20" /> {{ slotNode.label }}
            </slot>
          </template>
        </tree-node-item-new>
      </ul>

      <div v-else>Ничего не найдено</div>
    </div>
  </div>
  <div v-else>Некорректная структура дерева(не все ключи уникальные)</div>
</template>

<style scoped>
.tree-view {
  display: grid;
  gap: 10px;
}

.tree-view__input {
  width: 100%;
  max-width: 300px;
}

.tree {
  list-style-type: none;
  padding-left: 0;
  margin-left: 26px;
}
</style>
