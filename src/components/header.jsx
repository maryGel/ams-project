import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// MUI Icons
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



// import pages to send props to change header title accordingly




function Header( {headerTitle, setHeaderTitle} ) {

  const updateHeaderTitle = (newTitle) => { 
    setHeaderTitle(newTitle);
  }

  const setIcon = () => {

    if (headerTitle === 'Asset Management System') {
      return <HomeIcon
                sx={{ fontSize: 30, marginRight: 1.5 }}
                onClick={() => updateHeaderTitle('Asset Management System')}
              />;
    } else {
      return <ChevronLeftIcon
                sx={{ fontSize: 30, marginRight: 1.5 }}
                onClick={() => updateHeaderTitle('Asset Management System')}
              />;
    }
  }


  return (
    <>
      <header
        className="flex items-center p-2 pl-6 tracking-wider text-black bg-blue-100"      
      >
        <NavLink to="/">
          <button
            onClick={() => updateHeaderTitle('Asset Management System')}
          > 
            {setIcon()}
          </button>
        </NavLink>


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