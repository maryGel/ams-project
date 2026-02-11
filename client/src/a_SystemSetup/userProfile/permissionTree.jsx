import React from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const sampleData = [
  {
    id: "job_order_eval",
    label: "JOB ORDER - EVALUATION",
    children: [
      { id: "job_add", label: "Add" },
      { id: "job_delete", label: "Delete" },
      { id: "job_eval_done", label: "JO_EVAL_DONE" },
      { id: "job_edit", label: "Edit" },
      { id: "job_post", label: "Post" },
      { id: "job_print", label: "Print" },
      { id: "job_eval_update", label: "JO_EVAL_UPDATE" },
      { id: "job_view", label: "View" },
    ],
  },
  { id: "asset_list", label: "ASSET LIST" },
  { id: "acquisition", label: "ACQUISITION" },
  { id: "asset_disposal", label: "ASSET DISPOSAL" },
  { id: "maintenance", label: "MAINTENANCE" },
  { id: "asset_transfer", label: "ASSET TRANSFER" },
];

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    const child = n.children ? findNode(n.children, id) : undefined;
    if (child) return child;
  }
  return undefined;
}

function collectDescendants(node) {
  const ids = [];
  if (node.children && node.children.length) {
    for (const c of node.children) {
      ids.push(c.id);
      ids.push(...collectDescendants(c));
    }
  }
  return ids;
}

function computeParentState(node, checked) {
  const children = node.children || [];
  if (!children.length)
    return { checked: checked.has(node.id), indeterminate: false };

  let all = true;
  let any = false;

  for (const c of children) {
    const cState = computeParentState(c, checked);
    if (cState.checked || cState.indeterminate) any = true;
    if (!cState.checked) all = false;
  }

  return { checked: all, indeterminate: any && !all };
}

function filterTree(nodes, q) {
  if (!q) return nodes;
  const query = q.toLowerCase();
  const res = [];

  for (const n of nodes) {
    const matches = n.label.toLowerCase().includes(query);
    const filteredChildren = n.children ? filterTree(n.children, q) : [];
    if (matches || filteredChildren.length) {
      res.push({ ...n, children: filteredChildren });
    }
  }
  return res;
}

function collectExpandedIds(nodes) {
  const ids = [];
  for (const n of nodes) {
    if (n.children && n.children.length) {
      ids.push(n.id);
      ids.push(...collectExpandedIds(n.children));
    }
  }
  return ids;
}

function getLabelById(nodes, id) {
  const n = findNode(nodes, id);
  return n ? n.label : undefined;
}

{/* ---------------------------------------------------
  P E R M I S S I O N   T R E E   C O M P O N E N T
  ---------------------------------------------------*/}

export default function PermissionsTree() {
  const [checked, setChecked] = React.useState(new Set());
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState([]);

  const visibleData = React.useMemo(() => filterTree(sampleData, query), [query]);

    React.useEffect(() => {
      if (query) {
        setExpanded(collectExpandedIds(visibleData));
      }
    }, [query, visibleData]);

    const handleToggle = (id) => {
      const next = new Set(checked);
      const node = findNode(sampleData, id);
      if (!node) return;

      const descendants = collectDescendants(node);
      const isChecked = next.has(id);

      if (isChecked) {
        next.delete(id);
        descendants.forEach((d) => next.delete(d));
      } else {
        next.add(id);
        descendants.forEach((d) => next.add(d));
      }

      setChecked(next);
    };

    const allIds = React.useMemo(() => {
    const ids = [];
    const walk = (nodes) => {
      nodes.forEach((n) => {
        ids.push(n.id);
        if (n.children) walk(n.children);
        });
      };
      walk(sampleData);
      return ids;
    }, []);

    const allSelected = allIds.every((id) => checked.has(id));

    const handleSelectToggle = () => {
      if (allSelected) {
        setChecked(new Set());
      } else {
        setChecked(new Set(allIds));
      }
    };


      const handleUncheck = () => setChecked(new Set());

      const handleCopy = async () => {
        const labels = Array.from(checked)
          .map((id) => getLabelById(sampleData, id))
          .filter(Boolean)
          .sort();
        await navigator.clipboard.writeText(labels.join("\n"));
      };

    const renderNode = (node) => {
      const state = computeParentState(node, checked);

    return (
      <TreeItem
            key={node.id}
            nodeId={node.id}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  size="small"
                  checked={state.checked}
                  indeterminate={state.indeterminate}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(node.id);
                  }}
                />
                <Typography variant="body2">{node.label}</Typography>
              </Box>
            }
          >
            {node.children && node.children.map(renderNode)}
        </TreeItem>
      );
    };

    return (
      <div className='flex justify-between gap-3 flex-3'>
        <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
          <Typography variant="subtitle1"  mb={1}>
            User Access Rights
          </Typography>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 1,
              mb: 1,
              height: 260,
              overflow: "auto",
            }}
          >
            <TreeView
              expanded={expanded}
              onNodeToggle={(_, ids) => setExpanded(ids)}
              defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
              defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
            >
              {visibleData.map(renderNode)}
            </TreeView>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" variant="outlined" onClick={handleSelectToggle}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>

            <Button size="small" variant="outlined" onClick={handleCopy}>
              Copy
            </Button>
            <TextField
              size="small"
              placeholder="get"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ ml: "auto", width: 120 }}
            />
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
          <Typography variant="subtitle1" mb={1}>
            Approval Routing
          </Typography>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 1,
              mb: 1,
              height: 260,
              overflow: "auto",
            }}
          >
            <TreeView
              expanded={expanded}
              onNodeToggle={(_, ids) => setExpanded(ids)}
              defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
              defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
            >
              {visibleData.map(renderNode)}
            </TreeView>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" variant="outlined" onClick={handleSelectToggle}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>

            <Button size="small" variant="outlined" onClick={handleCopy}>
              Copy
            </Button>
            <TextField
              size="small"
              placeholder="get"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ ml: "auto", width: 120 }}
            />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, width: "100%" }}>
          <Typography variant="subtitle1" mb={1}>
            Departmental Access Control
          </Typography>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 1,
              mb: 1,
              height: 260,
              overflow: "auto",
              width: "100%",
            }}
          >
            <TreeView
              expanded={expanded}
              onNodeToggle={(_, ids) => setExpanded(ids)}
              defaultCollapseIcon={<ExpandMoreIcon fontSize="small" />}
              defaultExpandIcon={<ChevronRightIcon fontSize="small" />}
            >
              {visibleData.map(renderNode)}
            </TreeView>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" variant="outlined" onClick={handleSelectToggle}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>

            <Button size="small" variant="outlined" onClick={handleCopy}>
              Copy
            </Button>
            <TextField
              size="small"
              placeholder="get"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ ml: "auto", width: 120 }}
            />
          </Stack>
        </Paper>
    
    </div>
  );
}
