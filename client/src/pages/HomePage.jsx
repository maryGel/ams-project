import React from 'react';
import { Menu } from '@mui/material';
// import Header from '../components/header';
import TabPanel from '../components/Tabpanel';

function HomePage({
  headerTitle,
  setHeaderTitle
}) {

  return (
    <div>

      <TabPanel 
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
      />

    </div>
  );
}

export default HomePage;