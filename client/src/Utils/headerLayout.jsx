import { Outlet } from 'react-router-dom';
import Header from './header';

function Layout({ headerTitle, setHeaderTitle, username, navLink, setNavLink }) {
  return (
    <>
      <Header 
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        navLink={navLink}
        setNavLink={setNavLink}
        username={username}
      />
      <Outlet /> {/* Page content goes here */}
    </>
  );
};

export default Layout;