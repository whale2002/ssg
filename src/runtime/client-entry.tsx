import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ComponentType } from 'react'
import { App, initPageData } from "./App";
import { DataContext } from './hooks'

async function renderInBrowser() {
  const containerEl = document.getElementById("root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }

  if(import.meta.env.DEV) {
    const pageData = await initPageData(location.pathname)
    createRoot(containerEl).render(
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
        <App />
      </BrowserRouter>
      </DataContext.Provider>
    );
  } else {
    const islands = document.querySelectorAll('[__island]')
    if(islands.length === 0) return

    for(const island of islands) {
      const [id, index] = island.getAttribute('__island').split(':')
      const Element = window.ISLANDS[id] as ComponentType<unknown>;
      hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
    }
  }
}

renderInBrowser();