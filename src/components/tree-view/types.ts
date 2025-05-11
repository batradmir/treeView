import type { Ref } from 'vue'
import type { IconName } from '@/components/base-icon/types.ts'

export interface TreeNode {
  id: number
  icon?: IconName
  label: string
  children?: TreeNode[]
}
export const NODE_KEY = 'id'
export type TreeNodeId = TreeNode['id']

export interface TreeComposable {
  tree: Ref<TreeNode[]>
  openedNodes: Ref<Set<TreeNodeId>>
  selectedNodes: Ref<Set<TreeNodeId>>
  expandAll: () => void
  collapseAll: () => void
  selectAll: () => void
  clearSelectedAll: () => void
  handleToggle: (node: TreeNode) => void
  handleSelection: (node: TreeNode) => void
  isNodeOpened: (node: TreeNode) => boolean
  isNodeSelected: (node: TreeNode) => boolean
  isNodeIndeterminate: (node: TreeNode) => boolean
  hasChildren: (node: TreeNode) => boolean | undefined
}
