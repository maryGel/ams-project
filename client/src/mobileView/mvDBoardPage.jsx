import { useState } from 'react';
// Custom Hooks
import {useUsers} from '../hooks/useUsers';
import {dashItems} from './components/dashItems';
import { useJO_h } from '../hooks/useJO_h';
import { useJO_d } from '../hooks/useJO_d';
//Components
import JobOrderPage from './mvJobOrdersPage';





function MvDashBoard({useProps}){
    
    const { users } = useUsers();    
    const userName = localStorage.getItem('username') || 'User';
    const [isOpenJOs, setIsOpenJOs] = useState(false)

    const {joHeaders, isLoading, error} = useJO_h(useProps);
    const {joDetails} = useJO_d(useProps);

    // Find the user object
    const loginUser = users?.find(item => item.user === userName);

    // Get first name
    const firstName = loginUser?.fname || userName;

    // Count the pending JOs
    const joCount = (joHeaders || []).filter(jo => (jo.xpost === 3 || jo.xpost === 2) && jo.DISAPPROVED === 0).length;


    // Count of Documents template
    const items = dashItems({
      joCount: joCount,  // for Job Orders
    });

    const numStyles = 'pb-2  mr-2 text-xl font-semibold  cursor-pointer hover:underline hover:drop-shadow-[0_0_0.5rem_gray] transition-transform duration-150 active:translate-y-0.5 hover:scale-x-95';
    const boxStyles = 'p-1 flex justify-between h-auto shadow-md shadow-gray rounded-lg border';

    // .. handlers ..
    const handleOpenJOs = () => {
      setIsOpenJOs(prev => !prev)
    }

    return (
      <div className='flex flex-col md:hidden'>
        <div className='flex items-center w-auto h-auto p-1 pt-5 bg-white border-b '>
          <img
              className='w-12 h-10 pl-2 ml-2'
              src='/tripleeyelogo.png'
          />
          <span className='font-sans tracking-wider text-black '>Asset Mangement</span>
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
              <button onClick= {handleOpenJOs} className={`flex items-end bg-white ${boxStyles}`}>
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
            <JobOrderPage
              isOpenJOs = {isOpenJOs}
              setIsOpenJOs = {setIsOpenJOs}
              joHeaders={joHeaders}
              isLoading={isLoading}
              error={error}
              joDetails={joDetails}
              />
          }  
          </div>        
      </div>
    )
}

export default MvDashBoard;