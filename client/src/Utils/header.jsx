import React, {useEffect} from 'react';
import {headerTitleMap} from './headerTitleMap'
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


// MUI Icons
import { NavLink, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// import pages to send props to change header title accordingly

function Header() {

  const pagePath = useLocation();
  const currentPath = pagePath.pathname;

  // derive title from URL
  let headerTitle = headerTitleMap[currentPath];

   // Update <title> tag on path change
  useEffect(() => {  
    document.title = headerTitle;
  }, [headerTitle]);

  const getBackPath = () => {
    if (currentPath.startsWith("/assetFolder/assetMasterDisplay/")) {
      headerTitle = "Display Asset";
      return null;
    }

    if (currentPath === '/assetFolder/createAsset') {
      return '/assetFolder/pages/assetMasterList';
    } 

    if (currentPath === `/assetFolder/pages/referentialPage` || `/assetFolder/pages/assetMasterList`) {
      return '/Home';
    } 

    return null; // Default case if no match
  }

  const backPath = getBackPath();

  return (
    <>
      <header
        className="flex items-center p-2 pl-6 tracking-wider text-black bg-blue-100"      
      >

          <button> 
            {currentPath === '/Home' ? (
              <NavLink to="/Home">
                <HomeIcon 
                  sx ={{ fontSize: 30, marginRight: 2 }}
                />
              </NavLink>
            ) : (
              <NavLink to={backPath}>
                <ChevronLeftIcon 
                  sx ={{ fontSize: 30, marginRight: 2 }}
                />
              </NavLink>
            )}
          </button>


        <h1>{headerTitle}</h1>
        
        <div
          className="flex ml-auto mr-6 space-x-6 place-items-center"
        >
          <button>
            <SearchIcon 
              sx ={{ fontSize: 30, marginRight: 20 }}
            />
          </button>
          <button>
            <HistoryIcon
              sx ={{ fontSize: 30, marginRight: 1  }}
            />
          </button>
          <button>
            <NotificationsIcon
              sx ={{ fontSize: 30, marginRight: 1  }}
            />
          </button>
          <button>
            <AccountCircleIcon
              sx ={{ fontSize: 30, marginRight: 1  }}
            />
          </button>
        </div>
      </header>
    </>    
  );
}

export default Header;