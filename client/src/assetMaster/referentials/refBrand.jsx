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


import { IconButton, ThemeProvider, TextField  } from '@mui/material';

// Custom hooks
import { useRefBrand } from '../../hooks/refBrand';

// Custom table utilities & theme
import { customTheme, resizeColumn } from '../../components/customTable';
import useColumnWidths from '../../components/customTable';


export default function RefBrand({useProps, openTab,}) {
  const {refBrandData, loading, error} = useRefBrand(useProps); 
  const {handleResizeMouseDown, theaderStyle, tbodyStyle} = useColumnWidths();
  const [rows, setRows] = useState(refBrandData || []); // To hold the refBrand Data
  const [temporaryData, setTemporaryData] = useState(refBrandData || []);
  const [editMode, setEditMode] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


  useEffect(() => {
    setRows(refBrandData || []);
    setTemporaryData(refBrandData || []);
  }, [refBrandData]);

  const handleEditRow = () => {
    if (editMode) {
      setTemporaryData(rows); // Cancel editing - revert to original data
    }
    setEditMode(prev => !prev);
  };
  
  const handleCancelEdit = () => {
    setTemporaryData(rows);
    setEditMode(false);
  };

  const handleSave = () => {
    setRows(temporaryData);
    setEditMode(false);
    console.log('Data Saved:', temporaryData);
    // Add API save logic here
  };

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
  };
  

  if (loading) return <div className="p-4 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error loading data.. {error.message}</div>;

  return (
    <>
      {openTab === 'Brand' &&
        <ThemeProvider theme={customTheme}>
          <div className='w-auto p-4 h-full min-h-[600px] bg-white rounded-xl shadow-lg'>

            {/* ---------------Title and Buttons --------------- */}
            <div className='flex justify-end p-2 mb-3 w-100'>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={refBrandData.map((item) => item.BrandName)}
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
            
            <div className='flex items-center justify-between mt-6 mb-4'>
              <h1 className='text-xl font-semibold text-gray-800'>Brand List</h1>
                <div className="flex space-x-2">
                  <IconButton
                    aria-label={editMode ? "cancel" : "edit"}
                    onClick={editMode ? handleCancelEdit : handleEditRow}
                    color={editMode ? 'secondary' : 'default'}
                    title={editMode ? 'Cancel Changes' : 'Enable Editing'}
                    className='transition duration-150 hover:bg-gray-100'
                    size="medium"
                  >
                    {editMode ? <CancelIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                  </IconButton>

                    {editMode &&
                      <IconButton
                        color="primary"
                        title="Save Changes"
                        onClick={handleSave}
                        className='transition duration-150 hover:bg-indigo-100'
                      >
                        <SaveIcon />
                      </IconButton>
                    }

                    <IconButton
                      title="Download Data"
                      className='transition duration-150 hover:bg-gray-100'
                    >
                      <DownloadIcon />
                    </IconButton>
                </div>
            </div>
            {/* ----------------------------------------------------------- */}

            <div
              className='overflow-x-auto border border-gray-300 rounded-lg w-500'
              style={{ height: 400 }}
            >
              {/* ----------------------- TABLE STARTS HERE --------------------------- */}
              <table
                className="border-collapse w-100"
                style={{ tableLayout: 'fixed' /* important so column widths are respected */, }}
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
                        {sortConfig.key === 'BrandName' ? (
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
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>

                    {/* BRAND CODE */}
                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700 border-r border-gray-200'
                      style={theaderStyle('Code')}
                      onClick={() => handleSort('BrandID')}
                    >
                      Branch Code
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'BrandID' ? (
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
                        onMouseDown={(e) => handleResizeMouseDown('BrandID', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>

                    {/* BRAND NAME */}

                    <th
                      className='relative p-2 text-sm font-semibold text-left text-gray-700'
                      style={theaderStyle('Name')}
                      onClick={() => handleSort('BrandName')}
                    >
                      Branch Name
                      <span className="ml-8 text-gray-500">
                        {sortConfig.key === 'BrandName' ? (
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
                        onMouseDown={(e) => handleResizeMouseDown('BrandName', e)}
                        style={resizeColumn }
                        title="Resize column"
                      />
                    </th>
                  </tr>
                </thead>
                {/* ------------------ Table Header Ends Here */}

                <tbody>
                  {(editMode ? temporaryData : (rows || []).slice(0, 5)).map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b  border-gray-200 transition duration-100 ${editMode ? 'bg-inherit hover:bg-indigo-50' : 'hover:bg-gray-50'}`}
                      >
                      {/* ID column - not editable */}
                      <td className="p-2 border-r border-gray-200 pl-2text-sm bg-gray-50" style={tbodyStyle('id')}>
                        {row.id}
                      </td>

                      {/* Brand Code column */}
                      <td className="p-2 border-r border-gray-200 pl-2text-sm bg-gray-50" style={tbodyStyle('BrandID')}>
                        {editMode ? (
                          <input
                            type="text"
                            value={row.BrandID ?? ''}
                            onChange={(e) => handleTempChange(row.id, 'BrandID', e.target.value)}
                            className="w-full p-2 text-sm bg-white border-b border-gray-400 focus:border-indigo-600 focus:ring-0 focus:outline-none"
                            style={{ padding: '2px 0' }}
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          <span className="text-sm">{row.BrandID}</span>
                        )}
                      </td>

                      {/* Brand Name column */}
                      <td className="p-2 border-r border-gray-200 pl-2text-sm bg-gray-50" style={tbodyStyle('BrandName')}>
                        {editMode ? (
                          <input
                            type="text"
                            value={row.BrandName ?? ''}
                            onChange={(e) => handleTempChange(row.id, 'BrandName', e.target.value)}
                            className="w-full p-2 text-sm bg-white border-b border-gray-400 focus:border-indigo-600 focus:ring-0 focus:outline-none"
                            style={{ padding: '2px 0' }}
                            onFocus={(e) => e.target.select()}
                          />
                        ) : (
                          <span className="text-sm">{row.BrandName}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* ------------------------ TABLE ENDS HERE ---------------------------- */}

              <div className="flex justify-end p-2 text-sm text-gray-600 border-t border-gray-200 bg-gray-50">
                Showing 1 - 5 of {rows.length} rows
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              {editMode
                ? 'Editing enabled. Click the save icon to commit changes.'
                : `Click the Edit icon ${String.fromCodePoint(0x270E)} to enable editing.`
              }
            </p>
          </div>
        </ThemeProvider>
      }
    </>
  );
}
