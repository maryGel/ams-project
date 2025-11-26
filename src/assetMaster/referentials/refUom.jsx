// React
import { useState, useEffect } from 'react';

// Material UI - Icons & Components
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

import { IconButton, ThemeProvider, TextField, TablePagination, Snackbar, Alert,  
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Button
} from '@mui/material';

// Custom hooks
import { useRefUom } from '../../hooks/refUom'; // import the refUnit data

// Custom table utilities & theme
import { customTheme, resizeColumn } from '../../components/customTable';
import useColumnWidths from '../../components/customTable';

// ----------------------------------------------------------------------------
//                       REF UOM COMPONENT
// ----------------------------------------------------------------------------
export default function RefUom({useProps, openTab,}) {
  const {
    uomData, 
    loading, 
    error,
    createRefUnit,
    updateRefUnit,
    deleteRefUnit,
    refreshRefUnit,
  } = useRefUom(useProps)

  const {handleResizeMouseDown, theaderStyle, tbodyStyle} = useColumnWidths();
  const [rows, setRows] = useState(uomData || []); // To hold the refUnit Data
  const [temporaryData, setTemporaryData] = useState(uomData|| []);
  const [editingRowId, setEditingRowId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDeleteEmptyOpen, setConfirmDeleteEmptyOpen] = useState(false);
  const [pendingSaveRow, setPendingSaveRow] = useState(null);



  useEffect(() => {
    setRows(uomData || []);
    setTemporaryData(uomData || []);
  }, [uomData]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

// ✅ Add Row (Only One Editable)
const handleAddRow = () => {
  if (editingRowId !== null) return; // Safety block

  const lastId = rows.length > 0 ? Math.max(...rows.map(row => Number(row.id))) : 0;
  const newId = lastId + 1;

  const newRow = {
    id: newId,
    BrandID: '',
    Unit: '',
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

  const empty = !editedRow.Unit.trim();

  // If row is empty → ask user for confirmation
  if (empty) {
    setPendingSaveRow(editedRow);
    setConfirmDeleteEmptyOpen(true);
    return;
  }

  // ❗ Duplicate validation
  const isDuplicate = rows.some(row =>
    row.id !== editedRow.id && (
      row.Unit.trim().toLowerCase() === editedRow.Unit.trim().toLowerCase()
    )
    );

    if (isDuplicate) {
      showSnackbar("UOM already exists!", "error");
      return;
    }

    try {
      if (empty) {
        if (!editedRow.isNew) await deleteRefUnit(editedRow.id);
      } else if (editedRow.isNew) {
        await createRefUnit(editedRow.Unit);
      } else {
        await updateRefUnit(editedRow.id, editedRow.Unit);
      }

      await refreshRefUnit();
      setEditingRowId(null);
      showSnackbar('Changes has been saved!');
    } catch (err) {
      showSnackbar('Save failed: ' + err.message, 'error');
    }
  };

  const confirmDeleteEmpty = async () => {
    if (!pendingSaveRow) return;

    try {
      // If it's NOT new, emptying = delete row
      if (!pendingSaveRow.isNew) {
        await deleteRefUnit(pendingSaveRow.id);
      }

      await refreshRefUnit();

      showSnackbar("Unit has been deleted successfully!");
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
      const x = row.BrandID?.trim() || "";
      const c = row.Unit?.trim() || "";
      return !(x === "" && c === "");
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
    // Always include the currently edited row in results
    item.id === editingRowId ||
    // Normal search filter for other rows
    item.Unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id?.toString().includes(searchQuery)
  );

  const paginatedRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  

  if (loading) return <div className="p-4 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading data.. {error.message}</div>;

  return (
    <>
    {openTab === 'Unit of Measure' &&
      <ThemeProvider theme={customTheme}>
        <div key = {rows.id} className='w-auto h-full p-4 bg-white shadow-lg rounded-xl'>

          {/* Snackbar */}
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

          {/* Search */}
          <div className='flex justify-end mb-3'>
            <Autocomplete
              freeSolo
              options={rows.map(item => item.Unit)}
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

          {/* Title + Buttons */}
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-lg font-semibold text-gray-800'>Brand List</h1>

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

          {/* -------------------------- Table -------------------------------- */}
          <div className='overflow-x-auto border rounded-lg'>
            <table className="w-full border-collapse">

              <thead>
                <tr className='bg-gray-100 border-b'>
                  <th
                    className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                    onClick={() => handleSort('Unit')}
                    style={theaderStyle('Name')}
                  >
                    Unit of Measure
                    <span className="ml-8 text-gray-500">
                      {sortConfig.key === 'Unit' ? (
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
                      onMouseDown={(e) => handleResizeMouseDown('Unit', e)}
                      style={resizeColumn }
                      title="Resize column"
                    />
                  </th>
                  <th className='p-2 text-sm text-center'>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map(row => (
                  <tr
                    key={row.id}
                    className={`border-b ${editingRowId === row.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                  >
                      {/* Unit */}
                    <td className='p-1 pl-2'style={tbodyStyle('Unit')} >
                      {editingRowId === row.id ? (
                        <input
                          type="text"
                          value={row.Unit ?? ''}
                          onChange={(e) => handleTempChange(row.id, 'Unit', e.target.value)}
                          className="w-full p-1 border-b"
                        />
                      ) : (
                        row.Unit
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
              ? 'Click Edit or Add Row to begin editing.'
              : 'Editing one row. Save or Cancel to continue.'
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
