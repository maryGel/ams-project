import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button
} from "@mui/material";

//Custom hooks
import { useRefDepartment } from '../../../hooks/refDepartment';

function filterList(items, q) {
  if (!q) return items;
  const query = q.toLowerCase();
  return items.filter(item => 
    item.Department?.toLowerCase().includes(query) || 
    item.label?.toLowerCase().includes(query)
  );
}

{/*--------------------------------------------------
       D E P T    C O M P O N E N T
  --------------------------------------------------*/}

export default function DeptAccess({ isEditing, selectedUser, isCreating }) {
  const [checked, setChecked] = useState(new Set());
  const [query, setQuery] = useState("");
  
  // Use the hook with selected user
  const { refDeptData, loading, error } = useRefDepartment(selectedUser?.user);

  // Transform the data if needed - handle different possible structures
  const departmentList = useMemo(() => {
    if (!refDeptData) return [];
    
    // If it's already an array, use it
    if (Array.isArray(refDeptData)) {
      return refDeptData;
    }
        
    return [];
  }, [refDeptData]);

  // Get all IDs for select/deselect all functionality
  const allIds = useMemo(() => {
    return departmentList.map(item => item.id || item.deptId || `dept-${Math.random()}`);
  }, [departmentList]);

  // Set default selected state based on isEditing
  useEffect(() => {
    if (!isEditing && allIds.length > 0) {
      // When not editing, select all permissions by default
      setChecked(new Set(allIds));
    } else if (isEditing) {
      // When editing, start with empty selection
      setChecked(new Set());
    }
  }, [isEditing, allIds]);

  // Filter list based on search query
  const visibleData = useMemo(() => filterList(departmentList, query), [departmentList, query]);

  const allSelected = allIds.length > 0 && allIds.every((id) => checked.has(id));

  const handleSelectToggle = () => {
    if (!isEditing) return; // Don't allow when not editing
    
    if (allSelected) {
      setChecked(new Set());
    } else {
      setChecked(new Set(allIds));
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleItemClick = (id) => {
    if (!isEditing) return; // Don't allow when not editing
    
    setChecked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCheckboxClick = (e, id) => {
    e.stopPropagation(); // Prevent event bubbling to the ListItem
    if (!isEditing) return; // Don't allow when not editing
    
    setChecked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Loading state
  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
        <Typography>Loading department data...</Typography>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
        <Typography color="error">Error loading departments: {error}</Typography>
      </Paper>
    );
  }

  // Check if we have data
  if (!departmentList || departmentList.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
        <Typography>No departments available</Typography>
        <Typography variant="caption" color="text.secondary">
          Debug: refDeptData is {refDeptData ? 'present' : 'null/undefined'}
        </Typography>
      </Paper>
    );
  }

  console.log(`isCreating ${isCreating}`)
  return (
    <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
      <Typography variant="subtitle1"  fontWeight="bold" mb={1}>
        Department Access Control
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={query}
          onChange={handleSearchChange}
          disabled={!isEditing}
          sx={{width: 300}}
        />
        
        {isEditing && (
          <Button
            variant="body2"
            size="small"
            onClick={handleSelectToggle}
            disabled={!isEditing || visibleData.length === 0}
            sx={{textTransform: 'none' }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          height: 'auto',
          overflow: "auto",
          backgroundColor: !isEditing ? 'grey.50' : 'transparent',
        }}
      >
        <List dense>
          {visibleData.length > 0 ? (
            visibleData.map((item) => {
              const itemId = item.id || item.deptId || `dept-${item.Department || Math.random()}`;
              const isChecked = checked.has(itemId);
              
              return (
                <ListItem 
                  key={itemId}
                  sense
                  onClick={() => handleItemClick(itemId)}
                  sx={{ 
                    py: 0.5,
                    cursor: isEditing ? 'pointer' : 'default',
                    '&:hover': isEditing ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {},
                    backgroundColor: isChecked && isEditing ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  }}
                >
                  <ListItemIcon  sx={{ minWidth: 36 }}>
                    <Checkbox
                      size="small"
                      edge="start"
                      checked={isChecked}
                      disabled={!isEditing}
                      onClick={(e) => handleCheckboxClick(e, itemId)}
                      sx={{
                        py: 0, px: 0.5,
                        color: !isEditing ? 'gray' : 'primary.main',
                        '&.Mui-checked': {
                          color: !isEditing ? 'gray' : 'primary.main',
                        },
                        '&.Mui-disabled': {
                          color: !isEditing ? 'gray' : 'primary.main',
                          opacity: 0.8,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.Department}
                    primaryTypographyProps={{
                      sx: { 
                        color: !isEditing ? 'gray' : (isChecked ? 'primary.main' : 'text.primary'), 
                        fontSize: 'medium',
                        fontWeight: isChecked && isEditing ? 500 : 400,
                      }
                    }}
                  />
                </ListItem>
              );
            })
          ) : (
            <ListItem>
              <ListItemText 
                primary="No departments match your search" 
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
      
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Total: {departmentList.length} | Visible: {visibleData.length} | Selected: {checked.size}
        </Typography>
        {!isEditing && (
          <Typography variant="caption" color="text.secondary">
            (Read Only)
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}