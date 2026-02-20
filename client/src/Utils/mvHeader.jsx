import { Button, Menu, MenuItem } from '@mui/material';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TopicIcon from '@mui/icons-material/Topic';

function MvHeader({ 
    handleMenuOpen, 
    isMenuOpen,
}){
    return(
        <>
            <div className='flex items-center justify-between px-4 m-2 mb-3 text-black bg-blue-100 rounded-xl'>
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
            </div>
        </>
    );
};

export default MvHeader;