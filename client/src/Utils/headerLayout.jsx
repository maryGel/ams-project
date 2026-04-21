import { Outlet } from 'react-router-dom';
import Header from './header';

function Layout({ headerTitle, setHeaderTitle, username, isMobile }) {

  return (
    <>
      {!isMobile && 
        <Header 
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          username={username}
          isMobile={isMobile}
        />        
      }
      <Outlet /> 
    </>
  );
};

export default Layout;