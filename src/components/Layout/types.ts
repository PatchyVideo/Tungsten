// ====== Navigation Types ======
import type { Component } from 'vue'

// item
export type NavLinkItem = (
  | NavLinkRouter
  | NavLinkA
  | NavLinkComponents
  | NavGroupTitle
)
interface NavLinkMeta {
  name: string
  icon?: string
  noCloose?: boolean
}
interface NavLinkRouter extends NavLinkMeta {
  type: 'router'
  to: string
}
interface NavLinkA extends NavLinkMeta {
  type: 'a'
  url: string
}
interface NavLinkComponents extends NavLinkMeta {
  type: 'components'
  component: Component
}
interface NavGroupTitle extends NavLinkMeta {
  type: 'title'
}
