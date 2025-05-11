import type { InjectionKey } from 'vue'
import type { TreeComposable } from '@/components/tree-view/types.ts'

export const SYMBOL_TREE_VIEW = Symbol('SYMBOL_TREE_VIEW') as InjectionKey<TreeComposable>
