import { Outlet } from 'react-router-dom';
import Header from './header';

function Layout({ headerTitle, setHeaderTitle, username, navLink, setNavLink, isMobile }) {


  return (
    <>
      {!isMobile && 
        <Header 
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          navLink={navLink}
          setNavLink={setNavLink}
          username={username}
          isMobile={isMobile}
        />        
      }
      <Outlet /> 
    </>
  );
};

export default Layout;