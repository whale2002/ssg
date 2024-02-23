import { Layout } from "../theme-default";
import { routes } from 'island:routes'
import siteData from "island:site-data";
import { matchRoutes } from 'react-router-dom'
import type { PageData } from 'shared/types'

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath)

  if(matched) {
    const moduleInfo = await matched[0].route.preload()

    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc,
      title: moduleInfo.title || moduleInfo.frontmatter?.title || 'Island.js'
    }
  }

  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {},
    title: '404'
  }
}

export function App() {
  return (
    <Layout />
  )
}
