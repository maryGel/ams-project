import React, {useState} from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';

import {
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';



function ReferentialPage() {

  const [openGenSet, setOpenGenSet] = useState(false);
  const [openItemAssigment, setOpenItemAssigment] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null) 

  const handleGenSetClick = () => setOpenGenSet(prev => !prev);
  const handleItemClick = () => setOpenItemAssigment(prev => !prev);   
  const handleSubItemClick = (item) => setSelectedItem(item)

  return (
    <List
      sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleGenSetClick}>
        <ListItemIcon sx={{ minWidth: 0, marginRight: 1 }}>
          <SettingsIcon  />
        </ListItemIcon>
        <ListItemText primary="General Settings" />
        {openGenSet=== 'settings' ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openGenSet} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton 
            sx={{ 
              pl: 8,
              '&.Mui-selected': {
                  bgcolor: '#0091ea',
                  color: 'white',
                  '&:hover': { bgcolor: '#0091ea' },
                },
            }}
            selected = {selectedItem === 'Unit of Measure'}
            onClick = {() => handleSubItemClick('Unit of Measure')}
          >
            <ListItemText primary="Unit of Measure" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={handleItemClick}>
        <ListItemIcon sx={{ minWidth: 0, marginRight: 1 }}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Item Assignment" />
        {openItemAssigment ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItemAssigment} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {[
            'Asset Group',
            'Asset Class',
            'Location',
            'Department',
            'Depreciation Type',
            'Account Determination'
          ].map((item) => (
            <ListItemButton
              key={item}
              sx={{
                pl: 8,
                '&.Mui-selected': {
                  bgcolor: '#0091ea',
                  color: 'white',
                  '&:hover': { bgcolor: '#0091ea' },
                },
              }}
              selected={selectedItem === item}
              onClick={() => handleSubItemClick(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
}

export default ReferentialPage;