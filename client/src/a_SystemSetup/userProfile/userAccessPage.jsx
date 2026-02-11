import { useState } from 'react';

// MUI Components
import { Box, Autocomplete, TextField, TextareaAutosize, ThemeProvider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


// Components
import UseList from './userList';
import UserInfo from './userInfo';
import PermissionTree from './permissionTree';


export default function UserAccessPage(){  

    const [ isEditing, setIsEditing ] = useState(false);

    const handleEditButton = () => {
      setIsEditing(prev => !prev)
    }

    return(
      <div className='h-auto p-5 bg-gray-200 border rounded-lg m-7 border-spacing-1'>

        {/* ... B u t t o n s ... */}
        
        {/* Edit */}          
        <div className='flex items-center justify-between mb-4'>
          <div className='ml-.5'>
            <TextField
              size="small"
              placeholder="Search User"
              className='w-56 bg-white rounded-md'
              // value={query}
              // onChange={(e) => setQuery(e.target.value)}
              
            />
          </div>
          
          <div className='flex gap-2'>
              {/* Save */}
              {isEditing && (
                <button
                  className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-white transition-transform duration-200 ease-in-out bg-green-500 border rounded-full shadow-black border-spacing-1 active:scale-95 hover:bg-green-700'
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
              {/*  Create and Delete */}
              <button
                className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-gray-600 transition-transform duration-200 ease-in-out border rounded-full bg-slate-100 shadow-black border-spacing-1 active:scale-95 hover:text-gray-900 hover:bg-gray-300'
                title='Post this document'
                color="primary"
                sx={{ border: 1 }}
              >            
                <AddIcon />
                Create
              </button>
              <button
                className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-red-800 transition-transform duration-200 ease-in-out border rounded-full bg-slate-100 shadow-black border-spacing-1 active:scale-95 hover:text-red-700 hover:bg-slate-200'
                title='Post this document'
                color="primary"
                sx={{ border: 1 }}
              >           
                <DeleteIcon />
                Delete
              </button>
          </div>
        </div>
      
            <div className='grid grid-cols-[35rem_1fr] border border-spacing-2 bg-white rounded-lg p-2 mb-4'>
                <div className='p-2 '>
                  <UseList/>
                </div>
                <div className='p-2 '>
                    <UserInfo/>
                </div>
            </div>
            <div>
              <div className='border border-spacing-1'>
                    <PermissionTree/>
                </div>
            </div>
      </div>
    )
};