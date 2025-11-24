// React
import { useState, useEffect, useMemo } from 'react';

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



import { IconButton, ThemeProvider, TextField, TablePagination, Snackbar, Alert,
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Button
} from '@mui/material';

// Custom hooks
import { useRefItemClass } from '../../hooks/refClass';
import { useRefCategory } from '../../hooks/refCategory';

// Custom table utilities & theme
import { customTheme, resizeColumn } from '../../components/customTable';
import useColumnWidths from '../../components/customTable';


// ----------------------------------------------------------------------------
//                       REF ITEM CLASS COMPONENT
// ----------------------------------------------------------------------------
export default function RefItemClass({useProps, openTab,}) {
  const {
    refItemClassData,
    loading,
    error,
    createRefItemClass,
    updateRefItemClass,
    deleteRefItemClass,
    refreshItemClasses,
  } = useRefItemClass(useProps); 
  const {refCategoryData} = useRefCategory(useProps, [openTab])

  const {handleResizeMouseDown, theaderStyle, tbodyStyle} = useColumnWidths();
  const [rows, setRows] = useState(refItemClassData || []); // To hold the Data
  const [temporaryData, setTemporaryData] = useState(refItemClassData || []);
  const [editingRowId, setEditingRowId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteEmptyOpen, setConfirmDeleteEmptyOpen] = useState(false);
  const [pendingSaveRow, setPendingSaveRow] = useState(null);
  // const [addCategory, setAddCategory] = useState(refCategoryData || []);



  useEffect(() => {
    setRows(refItemClassData);
    setTemporaryData(refItemClassData);
  }, [refItemClassData]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const assetGrp = useMemo(() => {
    return refCategoryData.map(item => item.category);
  }, [refCategoryData]);
  console.log( `asset group: ${assetGrp}`)

  // const handleAddCategory = (item) => {
  //   setAddCategory(item)
  // }


  // ✅ Add Row (Only One Editable)
  const handleAddRow = () => {
    if (editingRowId !== null) return; // Safety block

    const lastId = rows.length > 0 ? Math.max(...rows.map(row => Number(row.id))) : 0;
    const newId = lastId + 1;

    const newRow = {
      id: newId,
      classCode: '',
      itemClass: '',
      category:'',
      isNew: true
    };

    setRows(prev => [...prev, newRow]);
    setTemporaryData(prev => [...prev, newRow]);

    setEditingRowId(newId);

    const totalRows = rows.length + 1;
    const newLastPage = Math.floor(totalRows / rowsPerPage);
    setPage(newLastPage);
  };
  
  // ✅ Update temp data for editable row
  const handleTempChange = (id, field, value) => {
    setTemporaryData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // ✅ Save One Row Only
  const handleSave = async () => {
  const editedRow = temporaryData.find(r => r.id === editingRowId);
  if (!editedRow) return;

  const empty = !editedRow.classCode.trim() && !editedRow.itemClass.trim();
  if (empty) {
    setPendingSaveRow(editedRow);
    setConfirmDeleteEmptyOpen(true);
    return;
  }

  // ❗ Duplicate validation
  const isDuplicate = rows.some(row =>
    row.id !== editedRow.id && (
      row.classCode.trim().toLowerCase() === editedRow.classCode.trim().toLowerCase() ||
      row.itemClass.trim().toLowerCase() === editedRow.itemClass.trim().toLowerCase()
    )
  );

  if (isDuplicate) {
    showSnackbar("Asset Class Code/Name already exists!", "error");
    return;
  }

  try {
    if (empty) {
      if (!editedRow.isNew) await deleteRefItemClass(editedRow.id);
    } else if (editedRow.isNew) {
      await createRefItemClass(editedRow.classCode, editedRow.itemClass, editedRow.category);
    } else {
      await updateRefItemClass(editedRow.id, editedRow.classCode, editedRow.itemClass, editedRow.category);
    }

    await refreshItemClasses();
    setEditingRowId(null);
    showSnackbar('Changes has been saved');
  } catch (err) {
    showSnackbar('Save failed: ' + err.message, 'error');
  }
  };

  const confirmDeleteEmpty = async () => {
    if (!pendingSaveRow) return;

    try {
      // If it's NOT new, emptying = delete row
      if (!pendingSaveRow.isNew) {
        await deleteRefItemClass(pendingSaveRow.id);
      }

      await refreshItemClasses();

      showSnackbar("Asset Class has been deleted successfully!");
    } catch (err) {
      showSnackbar("Failed: " + err.message, "error");
    }

    setEditingRowId(null);
    setPendingSaveRow(null);
    setConfirmDeleteEmptyOpen(false);
  };

  const cancelDeleteEmpty = () => {
    setConfirmDeleteEmptyOpen(false);
    setPendingSaveRow(null);
  };

  const removeEmptyRows = () => {
    const cleaned = rows.filter(row => {
      const x = row.classCode?.trim() || "";
      const c = row.itemClass?.trim() || "";
      const t = row.category?.trim() || "";
      return !(x === "" && c === "" && t==="");
    });
  
    setRows(cleaned);
    setTemporaryData(cleaned);
  };
  

  // ✅ Cancel Editing
  const handleCancelEdit = () => {
    removeEmptyRows()
    setEditingRowId(null);
  };

  // ✅ Enable editing for existing rows
  const handleEditExistingRow = (id) => {
    if (editingRowId !== null) return;
    setEditingRowId(id);
  };

  
  // ✅ Sort
  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...temporaryData].sort((a, b) => {
      const aVal = a[columnKey]?.toString().toLowerCase() ?? '';
      const bVal = b[columnKey]?.toString().toLowerCase() ?? '';
      return direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setTemporaryData(sorted);
    setSortConfig({ key: columnKey, direction });
  };

  // ✅ Filter + Paginate
  const filteredData = temporaryData.filter(item =>
    item.itemClass?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.classCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id?.toString().includes(searchQuery)
  );

  const paginatedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  if (loading) return <div className="p-4 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error ref Cat loading data.. {error.message}</div>;
    

  return (
    <>
      {openTab === 'Asset Class' &&
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
              <div className='flex justify-end mb-3'>
                <Autocomplete
                  freeSolo
                  options={rows.map(item => item.itemClass)}
                  value={searchQuery}
                  onInputChange={(e, v) => {
                    setSearchQuery(v);
                    setPage(0);
                  }}
                  renderInput={(params) =>
                    <TextField {...params} label="Search here" />
                  }
                  sx={{ width: 300 }}
                />
              </div>
           
            {/* Edit, Add, and Download button */}
            <div className='flex items-center justify-between mt-6 mb-4'>
              <h1 className='text-lg font-semibold text-gray-800'>Asset Group List</h1>
                <div className="flex space-x-1">
                   {/* Save */}
                {editingRowId !== null && (
                  <IconButton
                    title='Save Changes'
                    color="primary"
                    onClick={handleSave}
                    size="small"
                    sx={{ border: 1 }}
                  >
                    <SaveIcon />
                  </IconButton>
                )}

                {/* Cancel */}
                {editingRowId !== null && (
                  <IconButton
                    title='Cancel Changes'
                    color="secondary"
                    onClick={handleCancelEdit}
                    className='transition duration-150 hover:bg-indigo-100'
                    size="small"
                    sx={{ border: 1 }}
                  >
                    <CancelIcon />
                  </IconButton>
                )}

                {/* Add Row */}
                  <IconButton
                    onClick={handleAddRow}
                    disabled={editingRowId !== null}
                    size="small"
                    sx={{ border: 1 }}
                  >
                    <AddIcon />
                  </IconButton>

                  {/* Download */}
                  <IconButton size="small" sx={{ border: 1 }}>
                    <DownloadIcon />
                  </IconButton>

                </div>
            </div>
            
            {/* ----------------------- TABLE STARTS HERE --------------------------- */}

            <div className='overflow-x-auto border rounded-lg '>
              <table className="w-full border-collapse">

                {/* ----------------------- > TABLE HEADER */}
                <thead>
                  <tr className='bg-gray-100 border-b'>

                    {/* itemClass CODE */}
                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('Code')}
                      onClick={() => handleSort('classCode')}
                    >
                      Asset Class Code
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'classCode' ? (
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
                        onMouseDown={(e) => handleResizeMouseDown('classCode', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>

                    {/* itemClass NAME */}

                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('Name')}
                      onClick={() => handleSort('itemClass')}
                    >
                      Asset Class
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'itemClass' ? (
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
                        onMouseDown={(e) => handleResizeMouseDown('itemClass', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>

                    {/* itemClass NAME */}

                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('Name')}
                      onClick={() => handleSort('category')}
                    >
                      Asset Group
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'itemClass' ? (
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
                        onMouseDown={(e) => handleResizeMouseDown('itemClass', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>
                    <th className='p-2 text-sm text-center'>Action</th>
                  </tr>
                </thead>


                {/* ------------------ Table Body Starts Here */}

                <tbody>
                  {paginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b ${editingRowId === row.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                    >

                    {/* itemClass Code column */}
                    <td className='p-1 pl-2' style={tbodyStyle('classCode')}>
                      {editingRowId  === row.id?  (
                        <input
                          type="text"
                          value={row.classCode ?? ''}
                          onChange={(e) => handleTempChange(row.id, 'classCode', e.target.value)}
                          className="w-full p-1 border-b"
                        />
                      ) : (
                        row.classCode
                      )}
                    </td>

                    {/* itemClass Name column */}
                    <td className='p-1 pl-2'style={tbodyStyle('itemClass')} >
                    {editingRowId === row.id? (
                        <input
                          type="text"
                          value={row.itemClass ?? ''}
                          onChange={(e) => handleTempChange(row.id, 'itemClass', e.target.value)}
                          className="w-full p-1 border-b"
                        />
                      ) : (
                        row.itemClass
                      )}
                    </td>
                    {/* itemClass Name column */}
                    <td className='p-1 pl-2'style={tbodyStyle('category')} >
                    {editingRowId === row.id? (
                        <Autocomplete
                          value={row.category || ''}
                          options={assetGrp}
                          onChange={(e, newValue) => {
                            console.log("Selected category:", newValue);
                            handleTempChange(row.id, 'category', newValue || "")
                          }}
                          className="w-full p-1 border-b"
                          renderInput={(params) => (
                                        <TextField {...params} size="small" />
                                      )}
                        />
                      ) : (
                        row.category
                      )}
                    </td>
                      {/* Edit Action */}
                      <td className='p-1 pl-2 text-center'>
                        {editingRowId === null && (
                          <IconButton size="small" onClick={() => handleEditExistingRow(row.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </td>                                      
                  </tr>
                  ))}                  
                </tbody>                
              </table>
              {/* ------------------------ TABLE ENDS HERE ---------------------------- */}            


              <TablePagination
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {editingRowId === null
                ? 'Editing enabled. Click the save icon to commit changes.'
                : `Click the Edit icon ${String.fromCodePoint(0x270E)} to enable editing.`
              }
            </p>
          </div>
          <Dialog open={confirmDeleteEmptyOpen} onClose={cancelDeleteEmpty}>
            <DialogTitle>Confirm Empty Row</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This row is empty. Saving will remove this row. Do you want to continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDeleteEmpty}>Cancel</Button>
              <Button color="error" onClick={confirmDeleteEmpty}>Yes, Remove</Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      }
    </>
  );
}
