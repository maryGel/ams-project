import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from '@mui/icons-material/Check';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

//Custom hooks
import { useAccess } from '../../../hooks/useAccess';
import DeptAccess from './deptAccess';
import ApprovalRouting from './approvalRouting';


function filterTree(nodes, q) {
  if (!q) return nodes;
  const query = q.toLowerCase();
  const res = [];

  for (const n of nodes) {
    const matches = n.label?.toLowerCase().includes(query) || false;
    const filteredParent = n.parent ? filterTree(n.parent, q) : [];
    if (matches || filteredParent.length) {
      res.push({ ...n, parent: filteredParent });
    }
  }
  return res;
}

function collectAllIds(nodes) {
  const ids = [];
  const walk = (nodes) => {
    nodes.forEach((n) => {
      ids.push(n.id);
      if (n.children) walk(n.children);
    });
  };
  walk(nodes);
  return ids;
}


{/*--------------------------------------------------
       P E R M I S S I O N    C O M P O N E N T
  --------------------------------------------------*/}

export default function PermissionsTree({ isEditing, selectedUser, setSelectedUser, isCreating }) {
  const [checked, setChecked] = useState(new Set());
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState([]);
  
  // Use the hook with selected user
  const { accessData, loading, error } = useAccess(selectedUser?.user);

  // Tree data is already transformed from the hook
  const treeData = useMemo(() => {
    console.log('Tree data from hook:', accessData);
    return accessData || [];
  }, [accessData]);

  // Get all IDs for select/deselect all functionality
  const allIds = useMemo(() => {
    return collectAllIds(treeData);
  }, [treeData]);

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

  // Filter tree data based on search query
  const visibleData = useMemo(() => filterTree(treeData, query), [treeData, query]);

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

  const renderNode = (node) => {
    return (
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={
          <Box display="flex" alignItems="center" gap={3} sx={{padding: .3}}>
            <CheckIcon sx={{ fontSize: 'small'}}/>
            <Typography 
              variant="body2" 
              sx={{ color: !isEditing ? 'gray' : 'text.primary', fontSize: 'medium' }}
            >
              {node.label}
            </Typography>
          </Box>
        }
      >
        {node.children && node.children.map(renderNode)}
      </TreeItem>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex justify-between gap-3 flex-3'>
        <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
          <Typography>Loading access data...</Typography>
        </Paper>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex justify-between gap-3 flex-3'>
        <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className='flex justify-between h-auto gap-3 flex-3'>
      <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
        <Typography variant="subtitle1"  fontWeight="bold" mb={1}>
          User Access Rights
        </Typography>

        <div className='flex justify-between pb-3 ' >          
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={query}
            onChange={handleSearchChange}
            sx={{width: 300}}
          />
          {isEditing && (
            <Button 
              size="small" 
              variant="body2" 
              // onClick={handleSelectToggle}
              disabled={!isEditing && !isCreating }
              sx={{boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', backgroundColor: '#eceff1', textTransform: 'none'  }}
            >
               <AssignmentTurnedInIcon/> Assign Access
            </Button>
          )}
        </div>

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
          {visibleData.length > 0 ? (
            <TreeView
              expanded={expanded}
              onNodeToggle={(_, ids) => {
                setExpanded(ids);
              }}
              defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
              defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
            >
              {visibleData.map(renderNode)}
            </TreeView>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              No permissions available 
            </Typography>
          )}
        </Box>
        
        {visibleData.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total permissions: {allIds.length} 
          </Typography>
        )}
      </Paper>

      {/* Second Paper - Approval Routing */}
      <ApprovalRouting 
        selectedUser ={selectedUser}
        isEditing = {isEditing}
        setSelectedUser = { selectedUser }
        isCreating={isCreating}
      />

      {/* Third Paper - Departmental Access Control */}
      <DeptAccess
        selectedUser ={selectedUser}
        isEditing = {isEditing}
        setSelectedUser = { selectedUser }
        isCreating={isCreating}
      />
    </div>
  );
}