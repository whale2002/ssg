import 'uno.css';
import "../style/base.css";
import "../style/vars.css";
import "../style/doc.css";
import { Nav } from '../components/Nav'
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout'
import { usePageData } from '../../runtime';

export function Layout() {
  const pageData = usePageData()
  const { pageType } = pageData

  const getContent = () => {
    switch (pageType) {
      case 'home':
        return <HomeLayout />
      case 'doc':
        return <DocLayout />
      default:
        return <div>404</div>
    }
  }

  return (
    <div>
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