import { computed, ref, watch } from 'vue'
import type { TreeNode, TreeNodeId } from '@/components/tree-view/types.ts'
import { NODE_KEY } from '@/components/tree-view/types.ts'

// Композибл для работы с древовидной структурой
export function useTree(nodes: TreeNode[]) {
  const tree = ref<TreeNode[]>(nodes)

  const openedNodes = ref<Set<TreeNodeId>>(new Set())
  const selectedNodes = ref<Set<TreeNodeId>>(new Set())

  const parentMap = ref<Map<TreeNodeId, TreeNodeId | null>>(new Map())

  const buildParentMap = (nodes: TreeNode[], parentId: TreeNodeId | null = null) => {
    nodes.forEach((node) => {
      parentMap.value.set(node[NODE_KEY], parentId)
      if (node.children) {
        buildParentMap(node.children, node[NODE_KEY])
      }
    })
  }

  const nodeMap = ref<Map<TreeNodeId, TreeNode>>(new Map())

  const buildNodeMap = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      nodeMap.value.set(node[NODE_KEY], node)
      if (node.children) buildNodeMap(node.children)
    })
  }
  const initialize = () => {
    parentMap.value.clear()
    nodeMap.value.clear()
    buildNodeMap(tree.value)
    buildParentMap(tree.value)
  }
  initialize()

  const allNodeIds = computed(() => [...parentMap.value.keys()])

  const allNodeParentIds = computed(() => {
    const uniqueParents = new Set<TreeNodeId>()
    for (const id of parentMap.value.values()) {
      if (id !== null) uniqueParents.add(id)
    }
    return [...uniqueParents]
  })

  const expandAll = () => {
    openedNodes.value = new Set(allNodeParentIds.value)
  }

  const collapseAll = () => {
    openedNodes.value.clear()
  }

  const selectAll = () => {
    selectedNodes.value = new Set(allNodeIds.value)
  }

  const clearSelectedAll = () => {
    selectedNodes.value.clear()
  }
  const openNode = (node: TreeNode) => {
    openedNodes.value.add(node[NODE_KEY]);
  };

  const closeNode = (node: TreeNode) => {
    openedNodes.value.delete(node[NODE_KEY]);
  };

  const isNodeOpened = (node: TreeNode) => {
    if (!validateNode(node)) return false;

    return openedNodes.value.has(node[NODE_KEY]);
  };


  const handleToggle = (node: TreeNode) => {
    if (!validateNode(node)) return;

    if (isNodeOpened(node)) {
      closeNode(node);
    } else {
      openNode(node);
    }
  };


  const handleSelection = (node: TreeNode) => {
    if (!validateNode(node)) return

    selectedNodes.value = updateNodesSelection(node, new Set(selectedNodes.value))
  }

  const updateNodesSelection = (node: TreeNode, newSelection: Set<TreeNodeId>): Set<TreeNodeId> => {
    const nodeId = node[NODE_KEY]
    const isSelectedNow = newSelection.has(nodeId)

    if (isSelectedNow) {
      newSelection.delete(nodeId)
    } else {
      newSelection.add(nodeId)
    }
    // При взаимодействии с родителем все дочерние повторяют состояние
    updateAllChildren(node, newSelection, !isSelectedNow)

    // Нужно проверить родительские ноды
    updateAllParents(nodeId, newSelection)

    return newSelection
  }

  const updateAllChildren = (node: TreeNode, selection: Set<TreeNodeId>, select: boolean) => {
    if (!node.children) return

    for (const child of node.children) {
      if (select) {
        selection.add(child[NODE_KEY])
      } else {
        selection.delete(child[NODE_KEY])
      }
      updateAllChildren(child, selection, select)
    }
  }

  const updateAllParents = (nodeId: TreeNodeId, selection: Set<TreeNodeId>) => {
    let parentId = parentMap.value.get(nodeId)

    while (parentId !== null && parentId !== undefined) {
      const parent = nodeMap.value.get(parentId)

      if (!parent) break

      const allChildrenSelected =
        parent.children?.every((child) => selection.has(child[NODE_KEY])) ?? false

      if (allChildrenSelected) {
        selection.add(parentId)
      } else {
        selection.delete(parentId)
      }

      parentId = parentMap.value.get(parentId)
    }
  }



  const isNodeSelected = (node: TreeNode) => {
    if (!validateNode(node)) return false

    return selectedNodes.value.has(node[NODE_KEY])
  }

  const isNodeIndeterminate = (node: TreeNode): boolean => {
    if (!validateNode(node)) return false
    if (!node.children?.length) return false
    if (isNodeSelected(node)) return false

    for (const child of node.children) {
      if (
        selectedNodes.value.has(child[NODE_KEY]) ||
        (child.children && isNodeIndeterminate(child))
      ) {
        return true
      }
    }

    return false
  }

  const hasChildren = (node: TreeNode) => {
    if (!validateNode(node)) return false

    return !!node.children?.length
  }

  const openNodeAndParents = (node: TreeNode) => {
    const nodeId = node[NODE_KEY];

    openedNodes.value.add(nodeId);

    const parentId = parentMap.value.get(nodeId);

    if (
        parentId !== null &&
        parentId !== undefined &&
        !openedNodes.value.has(parentId)
    ) {
      const parentNode = nodeMap.value.get(parentId);
      if (parentNode) {
        openNodeAndParents(parentNode);
      }
    }
  };

  const validateNode = (node: TreeNode) => {
    if (!nodeMap.value.has(node[NODE_KEY])) {
      console.warn('Переданный node не найден')
      return false
    }
    return true
  }

  watch(
    tree.value,
    () => {
      initialize()
    },
    { deep: true },
  )

  return {
    tree,
    openedNodes,
    selectedNodes,
    expandAll,
    collapseAll,
    handleToggle,
    isNodeOpened,
    isNodeSelected,
    isNodeIndeterminate,
    selectAll,
    clearSelectedAll,
    hasChildren,
    handleSelection,
    openNodeAndParents
  }
}
