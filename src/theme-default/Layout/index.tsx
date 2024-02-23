import 'uno.css';
import "../style/base.css";
import "../style/vars.css";
import "../style/doc.css";
import { Nav } from '../components/Nav'
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout'
import { NotFoundLayout } from './NotFoundLayout';
import { usePageData } from '../../runtime';
import { Helmet } from 'react-helmet-async';

export function Layout() {
  const pageData = usePageData()
  const { pageType, title } = pageData

  const getContent = () => {
    switch (pageType) {
      case 'home':
        return <HomeLayout />
      case 'doc':
        return <DocLayout />
      default:
        return <NotFoundLayout></NotFoundLayout>
    }
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section
        style={{
          paddingTop: 'var(--island-nav-height)'
        }}>
        {getContent()}
      </section>
    </div>
  );
}