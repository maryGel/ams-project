import { useState, useMemo } from "react";
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
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

//Custom hooks
import { useApproval } from '../../../hooks/refApproval';


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
        A P P R O V A L    C O M P O N E N T
  --------------------------------------------------*/}

export default function ApprovalRouting({ isEditing, selectedUser, isCreating }) {
  const [checked, setChecked] = useState(new Set());
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState([]);
  
  // 1. Fetch data from your hook
  const { refApprovals, loading, error } = useApproval();

  // 2. Use refApprovals 
  const treeData = useMemo(() => {
    return refApprovals || [];
  }, [refApprovals]);

  const allIds = useMemo(() => collectAllIds(treeData), [treeData]);

  // 3. Logic for the Checkbox Toggles
  const handleNodeClick = (nodeId, children) => {
    if (!isEditing) return;
    
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        // Uncheck node and all its children
        next.delete(nodeId);
        if (children) children.forEach(child => next.delete(child.id));
      } else {
        // Check node and all its children
        next.add(nodeId);
        if (children) children.forEach(child => next.add(child.id));
      }
      return next;
    });
  };

  const visibleData = useMemo(() => filterTree(treeData, query), [treeData, query]);
  const allSelected = allIds.length > 0 && allIds.every((id) => checked.has(id));

  const handleSelectToggle = () => {
    if (!isEditing) return;
    setChecked(allSelected ? new Set() : new Set(allIds));
  };

  // 4. Render Tree Item with Checkbox logic
  const renderNode = (node) => {
    const isSelected = checked.has(node.id);

    return (
      <TreeItem
        key={node.id}
        nodeId={node.id.toString()}
        onClick={(e) => {
          // Prevent tree toggle when clicking the checkbox area specifically if desired
          handleNodeClick(node.id, node.children);
        }}
        label={
          <Box display="flex" alignItems="center" gap={1} sx={{ py: 0.5 }}>
            {/* Visual Checkbox */}
            <Box 
              sx={{ 
                width: 18, 
                height: 18, 
                border: '1px solid', 
                borderColor: isSelected ? 'primary.main' : 'grey.400',
                borderRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? 'primary.main' : 'transparent',
                transition: '0.2s'
              }}
            >
              {isSelected && <CheckIcon sx={{ fontSize: 14, color: 'white' }} />}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ color: !isEditing ? 'gray' : 'text.primary' }}
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

  // ... (Keep your Loading and Error states the same)

  return (
      <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Approval Routing 
        </Typography>

        <Stack direction="row" spacing={1} justifyContent={'space-between'} mb={2}>         
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ width: 300 }}
          />
          {isEditing && (
            <Button 
              size="small" 
              variant="body2"
              onClick={handleSelectToggle}
              sx={{ textTransform: 'none' }}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
        </Stack>

        <Box sx={{ border: "1px solid #eee", borderRadius: 1, height: 'auto', overflow: "auto" }}>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            onNodeToggle={(_, ids) => setExpanded(ids)}
          >
            {visibleData.map(renderNode)}
          </TreeView>
        </Box>
      </Paper>
  );
}