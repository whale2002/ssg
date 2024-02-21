import { UserConfig as ViteConfiguration } from 'vite'
import { ComponentType } from 'react'

export type NavItemWithLink = {
  text: string
  link: string
}

export interface Sidebar {
  [path: string]: SidebarGroup[]
}

export interface SidebarGroup {
  text?: string
  items: SidebarItem[]
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] }

export interface Footer {
  message?: string
  copyright?: string
}

export interface ThemeConfig {
  nav?: NavItemWithLink[]
  sidebar?: Sidebar
  footer?: Footer
}

export interface UserConfig {
  title?: string
  description?: string
  themeConfig?: ThemeConfig
  vite?: ViteConfiguration
}

export interface SiteConfig {
  root: string
  configPath: string
  siteData: UserConfig
}

export interface Header {
  id: string
  text: string
  depth: number
}

export interface FrontMatter {
  title?: string
  description?: string
  pageType?: string
  sidebar?: boolean
  outline?: boolean
}

export type PageType = 'home' | 'doc' | 'custom' | '404'

export interface PageData {
  pageType: PageType
  siteData: UserConfig
  pagePath: string
  frontmatter: FrontMatter
  toc?: Header[]
}

export interface PageModule {
  default: ComponentType
  frontmatter?: FrontMatter
  [key: string]: unknown
}
