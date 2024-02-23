import { App, initPageData } from "./App";
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';

export interface RenderRusult {
  appHtml: string
  islandProps: unknown[]
  islandToPathMap: Record<string, string>
}

export async function render(pagePath: string, helmetContext: object): Promise<RenderRusult> {
  const pageData = await initPageData(pagePath)

  const { clearIslandData, data } = await import('./jsx-runtime');
  clearIslandData()

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <DataContext.Provider value={pageData}>
        <StaticRouter location={pagePath}>
          <App />
        </StaticRouter>
      </DataContext.Provider>
    </HelmetProvider>
  )
  const { islandProps, islandToPathMap } = data;

  return {
    appHtml,
    islandProps,
    islandToPathMap
  }
}

export { routes } from 'island:routes'