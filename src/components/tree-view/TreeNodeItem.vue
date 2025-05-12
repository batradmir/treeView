<script setup lang="ts">
import { computed, inject } from 'vue'
import type { TreeNode } from '@/components/tree-view/types.ts'
import { SYMBOL_TREE_VIEW } from '@/components/tree-view/symbol.ts'
import BaseIcon from '@/components/base-icon/BaseIcon.vue'

const { node } = defineProps<{
  node: TreeNode
  selectable: boolean
}>()


defineSlots<{
  label(props: { node: TreeNode }): any
}>()

const treeState = inject(SYMBOL_TREE_VIEW)!
const {
  hasChildren,
  handleToggle,
  isNodeOpened,
  isNodeSelected,
  isNodeIndeterminate,
  handleSelection,
} = treeState

const isHasChildren = computed(() => {
  return hasChildren(node)
})
const isOpened = computed(() => isNodeOpened(node))
const isSelected = computed(() => isNodeSelected(node))
const isIndeterminate = computed(() => isNodeIndeterminate(node))
</script>

<template>
  <li class="tree-node">
    <div :class="['node-content', { 'node-content__no-children': !isHasChildren }]">
      <div v-if="isHasChildren" class="toggle-icon" @click.stop="handleToggle(node)">
        <div :class="['icon', { icon__rotated: isOpened }]">
          <base-icon name="arrow" :size="22" />
        </div>
      </div>

      <div v-if="selectable" class="node-checkbox">
        <input
          type="checkbox"
          :checked="isSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelection(node)"
        />
      </div>

      <div class="node-label">
        <slot name="label" :node="node" />
      </div>
    </div>

    <ul v-if="isHasChildren && isOpened">
      <tree-node-item
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selectable="selectable"
      >
        <template #label="{ node: slotNode } ">
          <slot name="label" :node="slotNode" />
        </template>
      </tree-node-item>
    </ul>
  </li>
</template>

<style scoped>
.tree-node {
  list-style: none;
  margin: 8px -26px;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.node-content__no-children {
  padding-left: 26px;
}

:deep(*) {
  .toggle-icon {
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }

  .icon {
    transition: transform 0.3s ease;
  }

  .icon.icon__rotated {
    transform: rotate(-90deg);
  }

  .node-checkbox {
    display: flex;

    input {
      cursor: pointer;
      height: 18px;
      width: 18px;
      accent-color: black;
      &:hover {
        opacity: 0.6;
      }
    }
  }

  .node-label {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
