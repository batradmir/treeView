import type { TreeNode, TreeNodeId } from '@/components/tree-view/types.ts'
import { NODE_KEY } from '@/components/tree-view/types.ts'

export const filterTree = (nodes: TreeNode[], searchTerm: string): TreeNode[] => {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return nodes

  return nodes
    .map((node) => {
      const isMatch = node.label.toLowerCase().includes(term)

      if (isMatch) {
        return { ...node }
      }

      if (node.children) {
        const filteredChildren = filterTree(node.children, searchTerm)
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren }
        }
      }

      return null
    })
    .filter(Boolean) as TreeNode[]
}

export const areAllKeyUnique = (tree: TreeNode[]): boolean => {
  const idSet = new Set<TreeNodeId>()

  const checkNode = (node: TreeNode): boolean => {
    if (idSet.has(node[NODE_KEY])) {
      return false
    }
    idSet.add(node[NODE_KEY])

    if (node.children) {
      for (const child of node.children) {
        if (!checkNode(child)) {
          return false
        }
      }
    }
    return true
  }

  for (const node of tree) {
    if (!checkNode(node)) {
      return false
    }
  }
  return true
}

export const generateTree = (): TreeNode[] => {
  return [
    {
      id: 1,
      icon: 'box',
      label: 'Архив',
      children: [
        {
          id: 11,
          icon: 'settings',
          label: 'Настройки',
          children: [
            {
              id: 111,
              icon: 'settings',
              label: 'Настройка 1',
              children: [{ id: 1111, icon: 'settings', label: 'Настройка 1-1' }],
            },
          ],
        },
        {
          id: 12,
          icon: 'home',
          label: 'Главная',
          children: [{ id: 121, icon: 'home', label: 'Главная 1' }],
        },
      ],
    },
    {
      id: 2,
      icon: 'calendar',
      label: 'Календарь',
      children: [
        { id: 21, icon: 'calendarPlus', label: 'Встреча 1' },
        { id: 22, icon: 'calendarPlus', label: 'Встреча 2' },
        { id: 23, icon: 'calendarPlus', label: 'Встреча 3' },
      ],
    },
    {
      id: 3,
      icon: 'star',

      label: 'Избранное',
      children: [
        {
          id: 31,
          icon: 'star',
          label: 'Основное',
          children: [{ id: 311, icon: 'calendar', label: 'Основное 1' }],
        },
        {
          id: 32,
          icon: 'star',
          label: 'Отложенное',
          children: [{ id: 321, icon: 'calendar', label: 'Отложенное 1' }],
        },
      ],
    },
  ]
}
