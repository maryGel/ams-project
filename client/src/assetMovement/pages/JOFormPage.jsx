import { useState } from 'react';

// MUI Components
import { Box, Autocomplete, TextField, TextareaAutosize, ThemeProvider } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PrintIcon from '@mui/icons-material/Print';
import AddBoxIcon from '@mui/icons-material/AddBox';

// Components
import AssetMoveTabs from '../custom Utils/tableTabs';

// Custom Utils
import { getAutocompleteSx } from '../../Utils/autocompleteStyles';  
import { customTheme } from '../../Utils/customTable';

// Custom Hooks
import { useRefDepartment } from '../../hooks/refDepartment'; 

export default function JOFormPage() {
  const { refDeptData } = useRefDepartment();
  const [ isEditing, setIsEditing ] = useState(false);

  const handleEditButton = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <>
      {/* ... B u t t o n s ... */}
      
      {/* Edit */}          
      <div className='flex justify-end gap-3 mx-20 my-4'>
        
        {/* Save */}
        {isEditing && (
          <button
            className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-white transition-transform duration-200 ease-in-out bg-green-500 border rounded-full shadow-black border-spacing-1 active:scale-95 hover:text-gray-600'
            title='Save Changes'
            color="primary"
            sx={{ border: 1 }}
            // onClick={handleSave}
          >
            <SaveIcon />
            Save
          </button>
        )}
        
        {/* Edit and Cancel */}
          <button
            className= {`flex justify-center pt-1 pb-1 pl-2 pr-3 text-white transition-transform duration-200 ease-in-out border rounded-full
              ${isEditing? 'bg-gray-600  hover:bg-gray-400 hover:text-white' : 'bg-blue-800 text-white hover:bg-blue-600' }  
              border-slate-300 active:scale-95`}
            title={isEditing? 'Cancel Edit' : 'Edit Asset'}
            type="button" // Use this to prevent from submission
            onClick={handleEditButton}
          >
            {isEditing ? 
              <><CancelIcon size ="small"/> <span>Cancel </span></>:
              <><EditIcon size ="small"/> <span>Edit</span></>
            }
          </button>
          {/*  Create , Post, and Preview */}
          <button
            className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-gray-600 transition-transform duration-200 ease-in-out border rounded-full bg-slate-200 shadow-black border-spacing-1 active:scale-95 hover:text-gray-800'
            title='Post this document'
            color="primary"
            sx={{ border: 1 }}
          >           
            <AddBoxIcon />
            Create
          </button>
          <button
            className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-black transition-transform duration-200 ease-in-out border rounded-full bg-slate-400 shadow-black border-spacing-1 active:scale-95 hover:text-green-700 hover:bg-slate-200'
            title='Post this document'
            color="primary"
            sx={{ border: 1 }}
          >           
            <AssignmentTurnedInIcon />
            Post
          </button>
          <button
            className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-gray-700 transition-transform duration-200 ease-in-out border rounded-full bg-slate-200 shadow-black border-spacing-1 active:scale-95 hover:text-gray-500'
            title='Preview and Print'
            color="primary"
            sx={{ border: 1 }}
          >           
            <PrintIcon />
            Preview
          </button>
      </div>
          
      <div className='p-6 my-4 bg-gray-100 rounded-lg shadow-lg mx-14'>
        <Box className='flex justify-between w-full h-full gap-1'>
          <h1 className='text-sm font-bold text-gray-800 '>Display Job Order</h1>
          <div className='flex gap-2'>
            <text className='text-xs text-gray-500'>Last JO created :</text>
            <text className='text-xs text-gray-500'>NNN-JO-0000014</text>
            <text className='text-xs text-gray-500'>Created on:</text>
            <text className='text-xs text-gray-500'>12/23/2026</text>

          </div>
        </Box>
        <form className='mt-8'>
            <label className='text-base font-normal text-gray-500 '>Job Order No : </label>
            <label className='text-base font-semibold text-gray-800 '>NNN-JO-0000014</label>
            <br/>
            <label className='text-base font-normal text-gray-500 '>Status : </label>
            <label className='text-base font-semibold text-gray-800 '>Posted - For Approval</label>
            
            <Box className='mt-2 '>


              <div className='flex items-center justify-start w-full gap-10 mt-4'>
                <label className='text-base font-normal text-gray-500 w-28 '>Department :</label>
                <Autocomplete 
                  disabled={!isEditing} 
                  sx={{width: '15rem', color: 'gray-500', border: '1px solid #ccc',}}
                  size = 'small'
                  options= {refDeptData.map(item => item.Department)} 
                  value={'IT Office' || ''}  
                  // onChange={(event, newValue) => onFieldChange('Unit', newValue)}
                  renderInput={(params) => (
                    <TextField {...params} 
                      sx={getAutocompleteSx(isEditing)}
                    />              
                  )} 
                />
                <label className='text-base font-normal text-gray-500 w-38 '>Maintenance Service :</label>
                <Autocomplete 
                  disabled={!isEditing} 
                  sx={{width: '15rem', color: 'gray-500', border: '1px solid #ccc',}}
                  size = 'small'
                  options= {refDeptData.map(item => item.Department)} 
                  value={'Electrical Unit' || ''}  
                  // onChange={(event, newValue) => onFieldChange('Unit', newValue)}
                  renderInput={(params) => (
                    <TextField {...params} 
                      sx={getAutocompleteSx(isEditing)}
                    />              
                  )} 
                />
                <label className='text-base font-normal text-gray-500 w-28 '>Requested by : </label>
                <label className='text-base font-semibold text-gray-500 '>mcagulada</label>
              </div>

              <div className='flex items-start justify-start w-full gap-10 mt-4'>
                <label className='pt-2 text-base text-gray-500 w-28 font-nornal '>Remarks : </label>
                <TextareaAutosize 
                  id = "remarks"
                  disabled={!isEditing} 
                  aria-label = "minimum height"
                  minRows={2}
                  value={'This is a sample remarks.' || ''}
                  className="text-gray-400"
                  style={{ 
                    width: '50rem',
                    resize: 'both',
                    padding: '.5rem',
                    border: '1px solid #ccc',
                    marginTop: '.5rem'
                  }}   
                />
              </div>
              
            </Box>
        </form>
      </div>    
      <ThemeProvider theme={customTheme}>
        <div className='my-4 bg-gray-100 rounded-lg shadow-lg mx-14'>
          <AssetMoveTabs/>
        </div>
      </ThemeProvider>

    </>
  )
}