import {useState, useEffect} from 'react';

import MvDashBoard from '../a_Dash/mvDBoardPage'
import MvHeader from '../Utils/mvHeader';

//MUI
import { Menu } from '@mui/material';
import FullWidthTabs from '../Utils/TabPanel'

function HomePage({
  headerTitle,
  setHeaderTitle,
  username,
  navLink,
  setNavLink,
  onLogout,
}) {

  
  const tabPaths = [
    { id: 0, link: '/Home'},
    { id: 1, link: '/Home/AssetMasterPage'},
    { id: 2, link: '/Home/Movement'},
    { id: 3, link: '/Home/Depreciation'},
    { id: 4, link: '/Home/Reports'},
    { id: 5, link: '/Home/PhysicalCount'},
    { id: 6, link: '/Home/SystemSetup'},
  ];


  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {isMobile && 
        <div className='flex flex-col min-h-screen bg-gray-100 md:hidden'>
          <MvDashBoard
            username={username}
          />
        </div>
      }
      {!isMobile && 
        <div className='md:flex'>
          <FullWidthTabs 
            setHeaderTitle={setHeaderTitle}
            setNavLink={setNavLink}
            tabPaths={tabPaths}
          />
        </div> 
      }
            
        <header className="fixed bottom-0 w-full p-1 md:hidden">
          <MvHeader/>
        </header>
    
    </>
  );
}

export default HomePage;