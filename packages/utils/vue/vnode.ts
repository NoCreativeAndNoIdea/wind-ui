import type { VNode } from 'vue'
import { Fragment, isVNode } from 'vue'

export enum PatchFlags {
  TEXT = 1,
  CLASS = 2,
  STYLE = 4,
  PROPS = 8,
  FULL_PROPS = 16,
  HYDRATE_EVENTS = 32,
  STABLE_FRAGMENT = 64,
  KEYED_FRAGMENT = 128,
  UNKEYED_FRAGMENT = 256,
  NEED_PATCH = 512,
  DYNAMIC_SLOTS = 1024,
  HOISTED = -1,
  BAIL = -2,
}

export function isFragement(node: VNode): boolean
export function isFragement(node: unknown): node is VNode
export function isFragement(node: unknown): node is VNode {
  return isVNode(node) && node.type === Fragment
}

export function isComment(node: VNode): boolean
export function isComment(node: unknown): node is VNode
export function isComment(node: unknown): node is VNode {
  return isVNode(node) && node.type === Comment
}

export function isValidElementNode(node: VNode): boolean
export function isValidElementNode(node: unknown): node is VNode
export function isValidElementNode(node: unknown): node is VNode {
  return isVNode(node) && !isFragement(node) && !isComment(node)
}
