import { useState, useRef } from 'react';
import { DataGrid, GridToolbar, GridRowModes, useGridApiRef  } from '@mui/x-data-grid';
import { 
  Checkbox,
  Box,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Chip,
  ClickAwayListener
} from '@mui/material';
import { Delete, Save, Undo, Add, Edit } from '@mui/icons-material';




export default function JOLineItems() {
  // State management
  const [selectionModel, setSelectionModel] = useState([]);
  const [rows, setRows] = useState(() => generateRows(5));
  const [editedRows, setEditedRows] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingRowId, setEditingRowId] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [focusedRowId, setFocusedRowId] = useState(null);

  const apiRef = useGridApiRef();

  // Generate initial data
  function generateRows(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      assetNum: `AST-${1000 + i}`,
      assetName: `Asset ${i + 1}`,
      description: `Description for asset ${i + 1}`,
      qty: Math.floor(Math.random() * 10) + 1,
      workDetails: `Work details for asset ${i + 1}`,
      status: ['Active', 'Inactive', 'Pending', 'Completed'][Math.floor(Math.random() * 4)],
      category: `Category ${(i % 3) + 1}`,
      class: `Class ${(i % 4) + 1}`,
      serialNo: `SN-${10000 + i}`,
      brand: `Brand ${(i % 5) + 1}`,
      location: `Location ${(i % 6) + 1}`,
      targetDate: `2024-01-${String(10 + (i % 20)).padStart(2, '0')}`,
      isNew: false,
    }));
  }

  // Handle double-click on row to enter edit mode
   const handleRowClick = (params) => {
      setFocusedRowId(params.id);
   };



  const handleSaveRow = (id) => {
  setRowModesModel((prev) => ({
    ...prev,
    [id]: { mode: GridRowModes.View },
  }));
};

  // Handle when edit mode starts
  const handleRowEditStart = (params) => {
      setTimeout(() => {
         params.api.setCellFocus(params.id, 'assetNum');
      });
   };


  // Handle when edit mode stops
  const handleRowEditStop = () => {
    setEditingRowId(null);
  };

  // Column definitions
  const columns = [
    {
      field: 'checkbox',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: (params) => {
        const allSelected = selectionModel.length === rows.length && rows.length > 0;
        const someSelected = selectionModel.length > 0 && selectionModel.length < rows.length;

        return (
          <Checkbox
            size="small"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectionModel(rows.map(row => row.id));
              } else {
                setSelectionModel([]);
              }
            }}
          />
        );
      },
      renderCell: (params) => (
        <Checkbox 
          size="small" 
          checked={selectionModel.includes(params.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectionModel([...selectionModel, params.id]);
            } else {
              setSelectionModel(selectionModel.filter(id => id !== params.id));
            }
          }}
        />
      ),
  },
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      editable: false,
    },
    { 
      field: 'assetNum', 
      headerName: 'Asset Num', 
      width: 120, 
      editable: true,
      required: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',       
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'assetName', 
      headerName: 'Asset Name', 
      width: 180, 
      editable: true,
      required: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 200, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'qty', 
      headerName: 'Qty', 
      width: 80, 
      type: 'number', 
      editable: true,
      valueParser: (value) => Math.max(0, parseInt(value) || 0),
      align: 'left',        // <-- align cell content
      headerAlign: 'left',
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'workDetails', 
      headerName: 'Details of Work', 
      width: 200, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Main. Status', 
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive', 'Pending', 'Completed', 'On Hold'],
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Active' ? 'success' :
            params.value === 'Completed' ? 'success' :
            params.value === 'Pending' ? 'warning' :
            params.value === 'On Hold' ? 'error' : 'default'
          }
          variant={editedRows[params.id] ? 'outlined' : 'filled'}
          sx={{ 
            border: editedRows[params.id] ? '2px solid #ed6c02' : undefined,
            backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : undefined,
          }}
        />
      ),
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Electronics', 'Machinery', 'Furniture', 'Vehicles', 'Other'],
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'class', 
      headerName: 'Class', 
      width: 120, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'serialNo', 
      headerName: 'Serial No.', 
      width: 120, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'brand', 
      headerName: 'Brand', 
      width: 120, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 150, 
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'targetDate', 
      headerName: 'Target Date', 
      width: 130,
      type: 'string',
      editable: true,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          backgroundColor: editedRows[params.id] ? 'rgba(237, 108, 2, 0.08)' : 'transparent',
        }}>
          {params.value}
        </Box>
      ),
    },
  ];

  // Event handlers
  const handleProcessRowUpdate = (newRow, oldRow) => {
  // Check if anything really changed
  const hasChanged = Object.keys(newRow).some(key => newRow[key] !== oldRow[key]);
  if (!hasChanged) return oldRow; // No changes, do nothing

  // Update rows
  setRows((prev) =>
    prev.map((row) => (row.id === newRow.id ? newRow : row))
  );

  // Remove from editedRows
  setEditedRows((prev) => {
    const copy = { ...prev };
    delete copy[newRow.id];
    return copy;
  });

  // Show snackbar only if changed
  setSnackbar({
    open: true,
    message: 'Row saved successfully!',
    severity: 'success',
  });

  return newRow;
};


  const handleDeleteSelected = () => {
    if (selectionModel.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select rows to delete',
        severity: 'warning'
      });
      return;
    }

    setRows(prev => prev.filter(row => !selectionModel.includes(row.id)));
    setSelectionModel([]);
    
    setSnackbar({
      open: true,
      message: `${selectionModel.length} row(s) deleted`,
      severity: 'success'
    });
  };

 const handleAddRow = () => {
  const newId = Math.max(...rows.map(r => r.id)) + 1;

  const newRow = {
    id: newId,
    assetNum: '',
    assetName: '',
    description: '',
    qty: 1,
    workDetails: '',
    status: 'Pending',
    category: '',
    class: '',
    serialNo: '',
    brand: '',
    location: '',
    targetDate: new Date().toISOString().split('T')[0],
    isNew: true,
  };

    setRows(prev => [newRow, ...prev]);
    setSelectionModel([newId]);
    setEditingRowId(newId);

    // 🔥 THIS IS THE KEY PART
    setEditedRows(prev => ({
      ...prev,
      [newId]: {
        oldRow: newRow,
        newRow: newRow,
      },
  }));

    // Put row into edit mode immediately
    setRowModesModel(prev => ({
      ...prev,
      [newId]: { mode: GridRowModes.Edit },
    }));

    setSnackbar({
      open: true,
      message: 'New row added. Start editing!',
      severity: 'info'
    });
};

const handleCellClick = (params) => {
  const { id, field } = params;

  apiRef.current.startRowEditMode({ id });
  apiRef.current.setCellFocus(id, field);

  setEditingRowId(id);
};


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Action Buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRow}
          sx={{ backgroundColor: '#01579b', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={handleDeleteSelected}
          color="error"
          disabled={selectionModel.length === 0}
        >
          Delete 
        </Button>
        
        {/* Visual indicator legend */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            backgroundColor: '#ed6c02',
            border: '2px solid white'
          }} />
          <span style={{ fontSize: '0.875rem', color: '#666' }}>
            Unsaved changes
          </span>
        </Box>
      </Box>

      {/* DataGrid */}
      <ClickAwayListener onClickAway={() => setFocusedRowId(null)}>
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          // Selection
          checkboxSelection={false}
          onCellClick={handleCellClick}
          selectionModel={selectionModel}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          // onSelectionModelChange={handleSelectionModelChange}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}

          // Edit mode handlers
          onRowEditStart={handleRowEditStart}
          
          // Editing
          editMode="row"
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Row update error:', error);
            setSnackbar({
              open: true,
              message: 'Error updating row. Please check the values.',
              severity: 'error'
            });
          }}
          // Features - ENABLED COLUMN RESIZING
          disableColumnResize={false} // This is the key prop - must be false
          disableColumnReorder={false}
          disableColumnMenu={false}
          columnVisibilityModel={{
            serialNo: false,
            brand: false,
          }}
          // Sorting & Filtering
          sortingMode="client"
          filterMode="client"
          // Pagination
          pagination
          pageSizeOptions={[5, 10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
            },
          }}
          // Toolbar
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}

        />
      </Box>
      </ClickAwayListener>


      {/* Status Bar */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>
            Total: {rows.length} rows • Selected: {selectionModel.length} • 
            {/* Edited: {Object.keys(editedRows).length} */}
          </span>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Custom CSS */}
      <style>{`
        '& .MuiDataGrid-columnSeparator': {
            visibility: 'visible',
            cursor: 'col-resize',
            },
            '& .MuiDataGrid-columnSeparator:hover': {
            color: 'rgba(0,0,0,0.6)',
            },
            '& .MuiDataGrid-columnSeparator': {
            minWidth: 6,
            },
            '& .MuiDataGrid-row': {
            cursor: 'pointer',
            },
      `}</style>
    </Box>
  );
}