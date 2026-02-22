import { Button } from '@mui/material';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';


// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TopicIcon from '@mui/icons-material/Topic';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// Components
import MvDashBoard from './mvDBoardPage'
import MvTansactionPage from './mvTransactionPage';


//BtnStyle
const btnStyle = 'flex flex-col py-2 items-center border justify-center '


function MobileHomePage({ 
    handleMenuOpen,
    username
}){
    const navigate = useNavigate();

    // Method 1: useMatch (most reliable for route-based highlighting)
    const isExactHome = useMatch('/Home');
    const isTransactions = useMatch('/Home/TransactionPage/*');
    const isAccount = useMatch('/Home/AccountPage/*');
    
    // Method 2: If you need more complex logic with pathname
    const location = useLocation();
    const pathname = location.pathname;
    
    // Using useMatch (recommended for tab highlighting)
    const isHomeTab = !!isExactHome; // true only for /Home
    const isTransTab = !!isTransactions; // true for /Home/TransactionPage and any sub-routes
    const isAcctTab = !!isAccount
    
    // Or using pathname for more control
    const isHomeByPath = pathname === '/Home' || pathname === '/Home/';
    const isTransByPath = pathname.startsWith('/Home/TransactionPage');
    const isAccountByPath = pathname.startsWith('/Home/AccountPage');

    const focusHomeBtn = isHomeTab ? 'bg-blue-200  border border-spacing-1' : '';
    const focusTransBtn = isTransTab ? 'bg-blue-200 border border-spacing-1' : '';
    const focusAcctBtn = isAcctTab ? 'bg-blue-200  border border-spacing-1' : '';

    // Navigate to Mobile Transaction Page
    const handleOnClickHome = () => {
      const path = `/Home`;
      navigate(path);    
    }

    // Navigate to Mobile Transaction Page
    const handleOnClickTrans = () => {
        const path = `/Home/TransactionPage`;
        navigate(path);        
    }

    // Navigate to Mobile Transaction Page
    const handleOnClickAcct = () => {
        const path = `/Home/AccountPage`;
        navigate(path);  
    }
    

    return(
        <>
          {pathname === '/Home' &&
            <div className='flex flex-col min-h-screen bg-gray-100 md:hidden'>
              <MvDashBoard
                  username={username}
              />
            </div>          
          }
          {pathname === '/Home/TransactionPage' &&
            <div className='md:hidden'>
              <MvTansactionPage
              />
            </div>          
          }
          
          <header className="fixed bottom-0 w-full md:hidden">
            <div className='grid grid-cols-3 m-3 text-black rounded-lg shadow-inner'>
              <div className={`${btnStyle} ${focusHomeBtn} rounded-l-lg `} >
                <Button 
                  className='transition-transform duration-75 active:translate-y-0.5'
                  sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                  onClick={handleOnClickHome}
                >
                  {isHomeTab 
                  ? <HomeIcon fontSize="medium" className='text-black'/> 
                  : <HomeOutlinedIcon/>}
                </Button>
                <span className='text-[10px]'>Home</span>
              </div>
              <div className={`${btnStyle} ${focusTransBtn}`}>
                <Button 
                  className='transition-transform duration-75 active:translate-y-0.5'
                  sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                  open = {handleMenuOpen}
                  onClick={handleOnClickTrans}
                >                            
                  {isTransTab 
                  ? <TopicIcon fontSize="medium" className='text-black'/> 
                  : <TopicOutlinedIcon/>}
                </Button>
                <span className='text-[10px]'>Transactions</span>
              </div>
              <div className={`${btnStyle} ${focusAcctBtn} rounded-r-lg`}>
                  <Button 
                    className='transition-transform duration-75 active:translate-y-0.5'
                    sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                    onClick={handleOnClickAcct}
                  >
                    {isAcctTab 
                    ? <AccountCircleIcon
                        fontSize="medium" 
                        className='text-black'
                        onClick = {handleMenuOpen}
                        aria-haspopup="true"/> 
                    : <AccountCircleOutlinedIcon/>}
                  </Button> 
                  <span className='text-[10px]'>Account</span>
              </div>               
          </div>
          </header>
        </>
    );
};

export default MobileHomePage;