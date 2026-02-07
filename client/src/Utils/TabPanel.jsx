import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// TabPanel component to render the content of each tab
import AssetMasterTile from '../assetMaster/assetMaster/assetMasterTile'
import AssetMovement from '../assetMovement/pages/assetMoveTile';
import Depreciation from '../assetDep/assetDepRun';
import AssetReports from '../assetReports/assetReport';
import PhysicalCount from '../assetPhysical/assetPhysicalCount';
import AssetUtilities from '../assetUtilities/assetUtilities';
import DashboardPage from '../assetDash/dashBoardPage';

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

/* --------------------------------------------
-          H O M E  * P A G E *  M E N U
-----------------------------------------------*/

export default function FullWidthTabs({
  headerTitle,
  setHeaderTitle,
  tabPaths
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync the tab highlight with the current URL on load/refresh
  const currentTabIndex = tabPaths.indexOf(location.pathname);
  const [value, setValue] = useState(currentTabIndex !== -1 ? currentTabIndex : 0);

  // 3. EFFECT: Redirect to Dashboard if path is just '/Home'
  useEffect(() => {
    if (location.pathname === '/Home') {
      // replace: true prevents the user from getting stuck when clicking "Back"
      navigate(tabPaths[0], { replace: true });
    }
  }, [location.pathname, navigate, tabPaths]);

  // 4. EFFECT: Keep the tab highlighted if the URL changes (e.g., via back button)
  useEffect(() => {
    if (currentTabIndex !== -1) {
      setValue(currentTabIndex);
    }
  }, [currentTabIndex]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(tabPaths[newValue]);
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
          <Tab label="DASHBOARD" {...a11yProps(0)} />
          <Tab label="ASSET MASTER" {...a11yProps(1)} />
          <Tab label="MOVEMENT" {...a11yProps(2)} />
          <Tab label="DEPRECIATION" {...a11yProps(3)} />
          <Tab label="REPORTS" {...a11yProps(4)} />
          <Tab label="PHYSICAL COUNT" {...a11yProps(5)} />
          <Tab label="UTILITIES" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <DashboardPage/>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <AssetMasterTile 
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}          
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <AssetMovement/>
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <Depreciation/>
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <AssetReports/>
      </TabPanel>
      <TabPanel value={value} index={5} dir={theme.direction}>
        <PhysicalCount/>
      </TabPanel>
      <TabPanel value={value} index={6} dir={theme.direction}>
        <AssetUtilities/>
      </TabPanel>
    </Box>
  );
}
