import { Button, Menu, MenuItem } from '@mui/material';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TopicIcon from '@mui/icons-material/Topic';

function MvHeader({ 
    handleMenuOpen, 
    handleMenuClose, 
    anchorEl,
    isMenuOpen,
    handleLogout,
}){
    return(
        <>
            <header className='fixed bottom-0 left-0 flex items-center justify-between w-full px-5 py-0.5 text-black bg-blue-100 rounded-xl md:hidden'>
                    <Button className='flex flex-col' sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}>
                        <HomeIcon 
                        fontSize="large" 
                        className='text-black'/>
                        <span className='text-[10px]'>Home</span>
                    </Button>
                    <Button className='flex flex-col' sx={{padding: 1.5, minWidth: 0, textTransform: 'none'}} open = {handleMenuOpen}>
                        <TopicIcon
                            fontSize="large" 
                            className='text-black'
                            onClick = {handleMenuOpen}
                            aria-controls={isMenuOpen ? 'log-menu' : undefined}
                            aria-haspopup="true"
                        />
                        <span className='text-[10px]'>Transactions</span>
                    </Button>
                    <Button className='flex flex-col'  sx={{padding: 1.5, minWidth: 0, textTransform: 'none'}} open = {handleMenuOpen}>
                        <AccountCircleIcon
                            fontSize="large" 
                            className='text-black'
                            onClick = {handleMenuOpen}
                            aria-controls={isMenuOpen ? 'log-menu' : undefined}
                            aria-haspopup="true"
                        />
                        <span className='text-[10px]'>Account</span>
                    </Button>
                
                    <Menu
                        id= 'log-menu'
                        className='text-sm'
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}                                     
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
            </header>
        </>
    );
};

export default MvHeader;