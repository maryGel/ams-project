// React
import { useState, useEffect } from 'react';

// Material UI - Icons & Components
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import { IconButton, ThemeProvider, TextField, TablePagination, Snackbar, Alert  } from '@mui/material';

// Custom hooks
import { useRefCategory } from '../../hooks/refCategory';

// Custom table utilities & theme
import { customTheme, resizeColumn } from '../../components/customTable';
import useColumnWidths from '../../components/customTable';

export default function RefCategory({useProps, openTab,}) {
  const {
    refCategoryData,
    loading,
    error,
    actionLoading,
    createRefCategory,
    updateRefCategory,
    deleteRefCategory,
    fetchRefCategories
  } = useRefCategory(useProps); 

  const {handleResizeMouseDown, theaderStyle, tbodyStyle} = useColumnWidths();
  const [rows, setRows] = useState(refCategoryData || []); // To hold the refBrand Data
  const [temporaryData, setTemporaryData] = useState(refCategoryData || []);
  const [editMode, setEditMode] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [addRow, setAddRow] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDel, setOpenDel] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, category }
  const [searchQuery, setSearchQuery] = useState("");


// In your component, add this useEffect for debugging:
  useEffect(() => {
    if (refCategoryData && refCategoryData.length > 0) {
      setRows(refCategoryData);
      setTemporaryData(refCategoryData);
    }
  }, [refCategoryData]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditRow = () => {
    if (editMode) {
      setTemporaryData(rows);
    }
    setEditMode(prev => !prev);
  };
  

  const handleAddRow = () => {  
    // Generate a unique ID 
    const lastId = rows.length > 0 ? Math.max(...rows.map(row => Number(row.id))) : 0; 
    const newId = lastId +1 ;
    const newRow = {
      id: newId,
      xCode: '',
      category: '',
      isNew: true // Flag to identify new rows
    };

    // Add new row to BOTH rows and temporaryData
    setRows(prev => [...prev, newRow]);
    setTemporaryData(prev => [...prev, newRow]);

    // Enable edit mode automatically
    setEditMode(true);
    
    // Jump to last page if paginated
    const totalRows = rows.length + 1;
    const newLastPage = Math.floor(totalRows / rowsPerPage);
    setPage(newLastPage);

  };

  const removeEmptyRows = () => {
    const cleaned = rows.filter(row => {
      const x = row.xCode?.trim() || "";
      const c = row.category?.trim() || "";
      return !(x === "" && c === "");
    });
  
    setRows(cleaned);
    setTemporaryData(cleaned);
  };
  
  
  const handleCancelEdit = () => {
    removeEmptyRows();
    setEditMode(false);
    setAddRow(true);
  };  

  const handleSave = async() => {
    try {
      // Separate new rows and updated rows
      const newRows = temporaryData.filter(row => row.isNew && row.category?.trim());
      const updatedRows = temporaryData.filter(row => 
        !row.isNew && 
        rows.find(originalRow => 
          originalRow.id === row.id && 
          (originalRow.category !== row.category || originalRow.xCode !== row.xCode)
        )
      );
  
      console.log('New rows to create:', newRows);
      console.log('Rows to update:', updatedRows);
  
      // Create new categories
      for (const row of newRows) {
        await createRefCategory(row.category, row.xCode || '');
      }
  
      // Update existing categories
      for (const row of updatedRows) {
        await updateRefCategory(row.id, row.category, row.xCode || '');
      }
      // Refresh data from server to get actual IDs and consistent state
      await fetchRefCategories();

      setEditMode(false);
      showSnackbar('Changes saved successfully!');
      
    } catch (error) {
      console.error('Error saving data:', error);
      showSnackbar('Failed to save changes: ' + error.message, 'error');
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      await deleteRefCategory(id);
      showSnackbar('Category deleted successfully!');
      setEditMode(false);
      setOpenDel(false)
      // The hook will automatically update refCategoryData, which will trigger useEffect
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar('Failed to delete category', 'error');
    }
  };

  const handleOpenDialog = (row) => {
    setDeleteTarget({ id: row.id, category: row.category });
    setOpenDel(true);
  };
  

  const handleCloseDialog = () => {
    setOpenDel(false);
  }

  const handleTempChange = (id, field, value) => {
    setTemporaryData(prevData => {
        const rowIndex = prevData.findIndex(row => row.id === id);
        if (rowIndex === -1) return prevData;

        const newRows = [...prevData];
        // Create a new row object with the updated field
        const newRow = { ...newRows[rowIndex], [field]: value };
        
        // Replace the old row reference with the new one
        newRows[rowIndex] = newRow;

        return newRows;
    });
  };

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    const sortedData = [...(editMode ? temporaryData : rows)].sort((a, b) => {
      const aValue = a[columnKey]?.toString().toLowerCase() ?? '';
      const bValue = b[columnKey]?.toString().toLowerCase() ?? '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  
    if (editMode) {
      setTemporaryData(sortedData);
    } else {
      setRows(sortedData);
    }
  
    setSortConfig({ key: columnKey, direction });
    setPage(0);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = (editMode ? temporaryData : rows).filter(item =>
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.xCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id?.toString().includes(searchQuery)
  );
  

  const displayedData = filteredData;

  const paginatedRows = displayedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <div className="p-4 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading data.. {error.message}</div>;
    

  return (
    <>
      {openTab === 'Asset Group' &&
        <ThemeProvider theme={customTheme}>
          <div key = {rows.id} className='w-auto h-full p-4 bg-white shadow-lg rounded-xl'>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Alert 
                  severity={snackbar.severity} 
                  onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                  {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ---------------Title and Buttons --------------- */}
            {/* Search button */}
              <div className='flex justify-end p-2 mb-3 w-100'>
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={refCategoryData.map((item) => item.category)}
                  value={searchQuery}
                  onInputChange={(event, newInputValue) => {
                    setSearchQuery(newInputValue);
                    setPage(0); // reset pagination when searching
                  }}
                  renderInput={(params) => 
                    <TextField {...params} label="Search here" 
                      sx={{
                        '& .MuiInputLabel-root': {
                          marginBottom: '2px',
                          paddingLeft: '5px',
                        },
                        border: 1, 
                        borderColor: 'grey.100', 
                        borderRadius: 2,
                      }}
                    />}
                  sx={{ width: 300, height: 30, }}
                />  
              </div>
            {/* Edit, Add, and Download button */}
            <div className='flex items-center justify-between mt-6 mb-4'>
              <h1 className='text-xl font-semibold text-gray-800'>Asset Group List</h1>
                <div className="flex space-x-1">
                  <IconButton
                    aria-label={editMode ? "cancel" : "edit"}
                    onClick={editMode ? handleCancelEdit : handleEditRow}
                    color={editMode ? 'secondary' : 'default'}
                    title={editMode ? 'Cancel Changes' : 'Enable Editing'}
                    className='transition duration-150 hover:bg-gray-100'
                    size="medium"
                    sx = {{border: 1,borderColor: 'grey.200'}}
                    disabled={actionLoading}
                  >
                    {editMode ? <CancelIcon fontSize='small'/> : <EditIcon fontSize='small' />}
                  </IconButton>

                    {editMode &&
                      <IconButton
                        color="primary"
                        title="Save Changes"
                        onClick={handleSave}
                        className='transition duration-150 hover:bg-indigo-100'
                        size="small"
                        sx = {{border: 1,borderColor: 'grey.200'}}
                        disabled={actionLoading}
                      >
                        <SaveIcon />
                      </IconButton>
                    }

                    {addRow && <IconButton
                      
                      title="Create Asset Group"
                      onClick={handleAddRow}
                      className='transition duration-150 hover:bg-gray-100'
                      size="small"
                      sx = {{border: 1,borderColor: 'grey.200'}}
                      disabled={actionLoading}
                    >
                      <AddIcon />
                    </IconButton>}
                    
                    <IconButton
                      title="Download Data"
                      className='transition duration-150 hover:bg-gray-100'
                      size="small"
                      sx = {{border: 1,borderColor: 'grey.200'}}
                    >
                      <DownloadIcon />
                    </IconButton>
                </div>
            </div>
            {/* ----------------------------------------------------------- */}

            <div
              className='w-auto h-auto overflow-x-auto border border-gray-300 rounded-lg'
              
            >
              {/* ----------------------- TABLE STARTS HERE --------------------------- */}
              <table
                className="border-collapse"
                style={{ tableLayout: 'fixed' /* important so column widths are respected */ }}
              >

                {/* ----------------------- > TABLE HEADER */}
                <thead>
                  <tr className='bg-gray-100 border-b border-gray-300 select-none'>

                    {/* ID */}
                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('id') }
                      onClick={() => handleSort('id')}
                    >
                      ID
                      <span className="ml-1 text-gray-500">
                        {sortConfig.key === 'id' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUpwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          ) : (
                            <ArrowDownwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          )
                        ) : (
                          <UnfoldMoreIcon fontSize="inherit" sx={{ fontSize: 16, opacity: 0.4 }} />
                        )}
                      </span>
                      <div
                        onMouseDown={(e) => handleResizeMouseDown('id', e)}
                        style={resizeColumn}
                        title="Resize column"
                      />
                    </th>

                    {/* CATEGORY CODE */}
                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('Code')}
                      onClick={() => handleSort('xCode')}
                    >
                      Asset Grp Code
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'xCode' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUpwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          ) : (
                            <ArrowDownwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          )
                        ) : (
                          <UnfoldMoreIcon fontSize="inherit" sx={{ fontSize: 16, opacity: 0.4 }} />
                        )}
                      </span>
                      <div
                        onMouseDown={(e) => handleResizeMouseDown('xCode', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>

                    {/* CATEGORY NAME */}

                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700'
                      style={theaderStyle('Name')}
                      onClick={() => handleSort('category')}
                    >
                      Asset Group
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'category' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUpwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          ) : (
                            <ArrowDownwardIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          )
                        ) : (
                          <UnfoldMoreIcon fontSize="inherit" sx={{ fontSize: 16, opacity: 0.4 }} />
                        )}
                      </span>
                      <div
                        onMouseDown={(e) => handleResizeMouseDown('category', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>
                  </tr>
                </thead>
                {/* ------------------ Table Header Ends Here */}

                <tbody>
                  {paginatedRows.map((row) => (
                    <tr
                    key={row.id}
                    className={`border-b  border-gray-200 transition duration-100 ${editMode ? 'bg-inherit hover:bg-indigo-50' : 'hover:bg-gray-50'}`}
                  >
                    {/* ID column - not editable */}
                    <td className="p-2 border-r border-gray-200 pl-2text-sm bg-gray-50" style={tbodyStyle('id')}>
                      {row.id}
                    </td>

                    {/* Category Code column */}
                    <td className="p-2 border-r border-gray-200 bg-gray-50" style={tbodyStyle('Code')}>
                      {editMode ? (
                        <input
                          type="text"
                          value={row.xCode ?? ''}
                          onChange={(e) => handleTempChange(row.id, 'xCode', e.target.value)}
                          className="w-full p-2 text-sm bg-white border-b border-gray-400 focus:border-indigo-600 focus:ring-0 focus:outline-none"
                          onFocus={(e) => e.target.select()}
                        />
                      ) : (
                        <span className="text-sm">{row.xCode}</span>
                      )}
                    </td>

                    {/* Category Name column */}
                    <td className="p-2 border-r border-gray-200 bg-gray-50" style={tbodyStyle('category')}>
                      {editMode ? (
                        <input
                          type="text"
                          value={row.category ?? ''}
                          onChange={(e) => handleTempChange(row.id, 'category', e.target.value)}
                          className="w-full p-2 text-sm bg-white border-b border-gray-400 focus:border-indigo-600 focus:ring-0 focus:outline-none"
                          onFocus={(e) => e.target.select()}
                        />
                      ) : (
                        <span className="text-sm">{row.category}</span>
                      )}
                    </td>
                     {/* Actions column */}
                     {editMode && (
                        <td className="p-2 border-l border-gray-200 bg-gray-50">
                          {!row.isNew && (
                            <button
                              onClick={() => handleOpenDialog(row)}
                              className="px-2 py-1 text-xs text-gray-600 rounded-full hover:bg-red-100 disabled:opacity-50"
                              // disabled={actionLoading}
                            >
                              <DeleteIcon sx ={{width : '18px'}}/>
                            </button>
                          )}
                        </td>
                      )} 
                                      
                  </tr>
                  ))}                  
                </tbody>                
              </table>
              {/* ------------------------ TABLE ENDS HERE ---------------------------- */}            

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              {editMode
                ? 'Editing enabled. Click the save icon to commit changes.'
                : `Click the Edit icon ${String.fromCodePoint(0x270E)} to enable editing.`
              }
            </p>
          </div>
              {openDel && (
                <Dialog
                  onClose = {handleCloseDialog}
                  open = {openDel} 
                  BackdropProps={{
                    sx: {
                      backgroundColor: "transparent", // remove dark overlay
                    }
                  }}
                  PaperProps={{
                    sx: {
                      // Optional: customize dialog paper
                      boxShadow: 1,
                      // bgcolor: '#fafafa'
                    }
                  }}             
                >
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={() => ({
                      position: 'absolute',
                      right: 5,
                      top: 5,
                      // color: theme.palette.grey[600],
                    })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <DialogContent
                    sx={{
                      width: 400,
                      padding: 3,
                      marginTop: 4,
                      color: '#01579b',
                      // bgcolor: '#b3e5fc'
                    }}
                  >
                    Are you sure you want to delete the <b>{deleteTarget?.category}</b>?
                  </DialogContent>
                  <DialogActions>
                    <Button sx={{color: 'blue'}} onClick={() => handleDeleteRow(deleteTarget.id)}>
                      Save changes
                    </Button>
                  </DialogActions>                          
                </Dialog>
              )}     
        </ThemeProvider>
      }
    </>
  );
}
