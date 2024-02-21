import 'uno.css';
import "../style/base.css";
import "../style/vars.css";
import { Nav } from '../components/Nav'
import { HomeLayout } from './HomeLayout';
import { usePageData } from '../../runtime';

export function Layout() {
  const pageData = usePageData()
  const { pageType } = pageData

  const getContent = () => {
    switch (pageType) {
      case 'home':
        return <HomeLayout />
      case 'doc':
        return <div>doc</div>
      default:
        return <div>404</div>
    }
  }

  return (
    <div>
      <Nav />
      {getContent()}
    </div>
  );
}