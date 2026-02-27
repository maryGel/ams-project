import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TopicIcon from '@mui/icons-material/Topic';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

//BtnStyle
const btnStyle = 'flex flex-col py-2 items-center border-t  justify-center '

export function MvHeader({
    handleOnClickHome,
    handleOnClickTrans,
    handleOnClickAcct,
    isAccountByPath,
    isHomeByPath,
    isTransByPath,
}){
    return (
        <>
        <header className="sticky bottom-0 w-full bg-white md:hidden">
            <div className='grid grid-cols-3 mb-2 text-black shadow-inner'>
              <div className={`${btnStyle} rounded-l-lg `} >
                <Button 
                  className='transition-transform duration-75 active:translate-y-0.5'
                  sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                  onClick={handleOnClickHome}
                >
                  {isHomeByPath
                  ? <HomeIcon fontSize="medium" className='text-black'/> 
                  : <HomeOutlinedIcon className='text-black'/>}
                </Button>
                <span className='text-[10px]'>Home</span>
              </div>
              <div className={`${btnStyle}`}>
                <Button 
                  className='transition-transform duration-75 active:translate-y-0.5'
                  sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                  onClick={handleOnClickTrans}
                >                            
                  {isTransByPath
                  ? <TopicIcon fontSize="medium" className='text-black'/> 
                  : <TopicOutlinedIcon className='text-black'/>}
                </Button>
                <span className='text-[10px]'>Transactions</span>
              </div>
              <div className={`${btnStyle} rounded-r-lg`}>
                  <Button 
                    className='transition-transform duration-75 active:translate-y-0.5'
                    sx={{paddingX: 1.5, paddingY:0, minWidth: 0, textTransform: 'none'}}
                    onClick={handleOnClickAcct}
                  >
                    {isAccountByPath
                    ? <AccountCircleIcon
                        fontSize="medium" 
                        className='text-black'
                        aria-haspopup="true"/> 
                    : <AccountCircleOutlinedIcon className='text-black'/>}
                  </Button> 
                  <span className='text-[10px]'>Account</span>
              </div>               
            </div>
          </header>
        </>
    )
}

export default MvHeader;