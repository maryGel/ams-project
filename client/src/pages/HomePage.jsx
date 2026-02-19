import MvDashBoard from '../a_Dash/mvDBoardPage'
import MvHeader from '../Utils/mvHeader';

//MUI
import { Menu } from '@mui/material';
import TabPanel from '../Utils/TabPanel'

function HomePage({
  headerTitle,
  setHeaderTitle,
  tabPaths
}) {


  return (
    <>
      <div className='flex flex-col min-h-screen bg-gray-100 md:hidden'>
        <MvDashBoard />
      </div>
      <div className='hidden md:flex'>
        <TabPanel 
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
          tabPaths = {tabPaths}
        />
      </div>    
      
      <header className="fixed bottom-0 left-0 flex items-center justify-between w-full px-10 py-2 text-black md:hidden">
        <MvHeader/>
      </header>
    
    </>
  );
}

export default HomePage;