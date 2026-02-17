import {useState, useEffect} from 'react';
import {headerTitleMap} from './headerTitleMap'
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, InputBase, Menu, MenuItem } from '@mui/material';


// MUI Icons
import { NavLink, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function Header({tabPaths = [], username , onLogout}) {

  const pagePath = useLocation();
  const currentPath = pagePath.pathname;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isHomeTab = tabPaths.includes(currentPath); //Determine if we are on a "Home" tab

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  // derive title from URL
  let headerTitle = headerTitleMap[currentPath];

   // Update <title> tag on path change
  useEffect(() => {  
    document.title = headerTitle;
  }, [headerTitle]);

  const getBackPath = () => {
    if (currentPath.startsWith("/assetFolder/assetMasterDisplay")) {
      return '/assetFolder/pages/assetMasterList';
    } 
    if (currentPath.startsWith('/assetFolder/createAsset')) {
      return '/assetFolder/pages/assetMasterList';
    } 
    if (currentPath.startsWith('/assetMovement/pages/JOFormPage')) {
      return '/Home/Movement';
    }
    if (currentPath.startsWith('/systemSetup/user/userProfile')) {
      return '/Home/SystemSetup';
    }
    
    if (currentPath === `/assetFolder/pages/assetMasterList` || `/assetFolder/pages/referentialPage`) {
      return '/Home/AssetMasterPage';
    } 

    return null; // Default case if no match
  }

  const backPath = getBackPath();
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
  };

  return (
    <>
      <header className="flex items-center p-2 pl-6 tracking-wider text-black bg-blue-100" >

          <button className='transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95'> 
            {isHomeTab? (
              <NavLink to= "/Home">
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
        
        <div className="flex ml-auto mr-6 space-x-6 place-items-center">
          <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}  
            placeholder="Search"          
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '0.1rem 0.5rem',
              borderRadius: '10rem',
              width: isHovered ? '30rem' : '5rem', 
              transition: 'width 0.4s ease-in-out',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid gray'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ fontSize: 28, color: 'black' }} />
            </Box>
            
            <InputBase
              placeholder="Search..."
              sx={{
                ml: 1,
                flex: 1,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                visibility: isHovered ? 'visible' : 'hidden'
              }}
            />
          </Box>
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
          <div  className="flex items-center gap-2">
            <button onClick={handleMenuOpen} aria-controls={isMenuOpen ? 'account-menu' : undefined} aria-haspopup="true">
              <AccountCircleIcon
                sx ={{ fontSize: 30, marginRight: 1  }}
              />
            </button>
            <span>Hi, {username}! </span>
             <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </header>
    </>    
  );
}

export default Header;