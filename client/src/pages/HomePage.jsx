import React from 'react';
import { Menu } from '@mui/material';

// import Header from '../components/header';
import TabPanel from '../Utils/TabPanel'

function HomePage({
  headerTitle,
  setHeaderTitle,
  tabPaths
}) {

  return (
    <div
      className='hidden md:flex'
    >

      <TabPanel 
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        tabPaths = {tabPaths}
      />

    </div>
  );
}

export default HomePage;