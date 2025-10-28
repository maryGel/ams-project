import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// TabPanel component to render the content of each tab

import AssetMasterTile from '../assetMaster/assetMasterTile';
import AssetMovement from '../assetMovement/assetMove';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({
  headerTitle,
  setHeaderTitle
}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box  sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          sx={{ bgcolor: 'white', color: '#263238', fontFamily: 'Roboto' }}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="ASSET MASTER" {...a11yProps(0)} />
          <Tab label="MOVEMENT" {...a11yProps(1)} />
          <Tab label="DEPRECIATION" {...a11yProps(2)} />
          <Tab label="REPORTS" {...a11yProps(3)} />
          <Tab label="PHYSICAL COUNT" {...a11yProps(4)} />
          <Tab label="UTILITIES" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <AssetMasterTile 
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}          
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <AssetMovement />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        Item Three
      </TabPanel>
    </Box>
  );
}
