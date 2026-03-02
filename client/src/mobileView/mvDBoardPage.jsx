import { useState } from 'react';
// Custom Hooks
import {useUsers} from '../hooks/useUsers';
import {dashItems} from './components/dashItems';
import { useJO_h } from '../hooks/useJO_h';
import { useJO_d } from '../hooks/useJO_d';
import { useTR_h } from '../hooks/useTR_h';
import { useTR_d } from '../hooks/useTR_d';
import { useAD_h } from '../hooks/useAD_h';
import { useAD_d } from '../hooks/useAD_d';
//Components
import MvJobOrderPage from './mvJobOrdersPage';
import MvTransferPage from './mvTransferPage';
import MvDisposalPage from './mvDisposalPage';


function MvDashBoard({useProps}){
    
    const { users } = useUsers();    
    const userName = localStorage.getItem('username') || 'User';
    const [isOpenJOs, setIsOpenJOs] = useState(false)
    const [isOpenTransfer, setIsOpenTransfer] = useState(false)
    const [isOpenDisposal, setIsOpenDisposal] = useState(false)

    // Job Orders Data
    const {joHeaders, isLoading, error} = useJO_h(useProps);
    const {joDetails} = useJO_d(useProps);
    // Transfer Data
    const {trHeaders} = useTR_h(useProps);
    const {trDetails} = useTR_d(useProps);
    // Disposal Data
    const {adHeaders} = useAD_h(useProps);
    const {adDetails} = useAD_d(useProps);




  

    // Find the user object
    const loginUser = users?.find(item => item.user === userName);

    // Get first name
    const firstName = loginUser?.fname || userName;

    // Count the pending docs
    const joCount = (joHeaders || []).filter(jo => (jo.xpost === 3 || jo.xpost === 2) && jo.DISAPPROVED === 0).length;
    const trCount = (trHeaders || []).filter(tr => (tr.xpost === 3 || tr.xpost === 2) && tr.DISAPPROVED === 0).length;
    const adCount = (adHeaders || []).filter(ad => (ad.xpost === 3 || ad.xpost === 2) && ad.DISAPPROVED === 0).length;


    // Count of Documents template
    const items = dashItems({
      joCount: joCount, 
      trCount: trCount,
      adCount: adCount
    });

    const numStyles = 'pb-2  mr-2 text-xl font-semibold  cursor-pointer hover:underline hover:drop-shadow-[0_0_0.5rem_gray] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
    const boxStyles = 'p-1 flex justify-between h-auto shadow-md shadow-gray rounded-lg border';

    // .. handlers ..
    const handleOpenDash = (dashId) => {
      if(dashId === 1 ){setIsOpenJOs(prev => !prev)}
      if(dashId === 3){setIsOpenTransfer(prev => !prev)}
      if(dashId === 5){setIsOpenDisposal(prev => !prev)}
      
    }

    return (
      <div className='flex flex-col md:hidden'>
        <div className='flex items-center w-auto h-auto p-1 pt-5 bg-white border-b '>
          <img
              className='w-12 h-10 pl-2 ml-2'
              src='/tripleeyelogo.png'
          />
          <span className='font-sans tracking-wider text-black '>Asset Management</span>
        </div>

        <div className='flex items-center justify-between px-5 pt-3 pb-3 m-4 font-semibold tracking-wide bg-blue-100 rounded-md shadow-md text-md'>
          <h1 className='pl-1 font-sans'>Dashboard</h1>
          <img
              className='w-8'
              src='/icons/menu_icons/dashboard.png'
          />
        </div>  
          <h1 className='mt-5 ml-5'>Hi, {firstName}!</h1>

          <div className='grid w-full grid-cols-2 gap-3 px-4 mt-7'>                
            {items.map(item => 
              <button onClick= {()=> handleOpenDash(item.id)} className={`flex items-end bg-white ${boxStyles}`}>
                <div className='flex flex-col justify-start gap-2 p-2 '>
                    <img
                        className='w-8 h-8 bg-white'
                        src={item.imgSrc}
                        />
                    <span className='text-sm'>{item.title}</span>
                </div>
                <span className={numStyles}>{item.num}</span> 
              </button>)}
          </div>  

          <div className='flex flex-col justify-center'>
          {isOpenJOs &&
            <MvJobOrderPage

              setIsOpenJOs = {setIsOpenJOs}
              joHeaders={joHeaders}
              isLoading={isLoading}
              error={error}
              joDetails={joDetails}
              />
          }
          {isOpenTransfer &&
            <MvTransferPage
              setIsOpenTransfer = {setIsOpenTransfer}
              trHeaders = {trHeaders}
              trDetails = {trDetails}
            />
          }  
          {isOpenDisposal &&
            <MvDisposalPage 
              setIsOpenDisposal ={setIsOpenDisposal}
              adHeaders = {adHeaders}
              adDetails = {adDetails}
            />
          }
          </div>        
      </div>
    )
}

export default MvDashBoard;