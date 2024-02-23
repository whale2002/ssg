import { UserConfig as ViteConfiguration } from 'vite'
import { ComponentType } from 'react'

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>
    ISLAND_PROPS: unknown[]
  }
}

export type PropsWithIsland = {
  __island?: boolean
}

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
  toc?: Header[]
  [key: string]: unknown
}

export interface Feature {
  icon: string
  title: string
  details: string
}

export interface Hero {
  name: string
  text: string
  tagline: string
  image?: {
    src: string
    alt: string
  }
  actions: {
    text: string
    link: string
    theme: 'brand' | 'alt'
  }[]
}

export interface FrontMatter {
  title?: string
  description?: string
  pageType?: PageType
  sidebar?: boolean
  outline?: boolean
  features?: Feature[]
  hero?: Hero
}
