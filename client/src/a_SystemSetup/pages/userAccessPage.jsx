import { useState } from 'react';

// MUI Components
import { Box, Autocomplete, TextField, TextareaAutosize, ThemeProvider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Custom Utils
import { CustomBtn } from '../../Utils/groupbtns';

// Components
import UseList from '../userProfile/userList';
import UserInfo from '../userProfile/userInfo';
import PermissionTree from '../userProfile/permissionTree';


export default function UserAccessPage(){  

    const [ isEditing, setIsEditing ] = useState(false);

    const handleEditButton = () => {
      setIsEditing(prev => !prev)
    }

    return(
      <div className='h-auto p-5 border rounded-lg bg-gray-50 m-7 border-spacing-1'>

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
                <CustomBtn
                  variant='saveBtn'
                  iconType='save'
                  title='Save Changes'
                  // onClick={handleSave}
                >
                  Save
                </CustomBtn>
              )}
              
              {/* Edit and Cancel */}
              <CustomBtn
                variant={isEditing ? 'cancelBtn' : 'editBtn'}
                iconType={isEditing ? 'cancel' : 'edit'}
                title={isEditing? 'Cancel Edit' : 'Edit Asset'}
                onClick={handleEditButton}
              >
                {isEditing ? 
                  <><span>Cancel</span></>:
                  <><span>Edit</span></>
                }
              </CustomBtn>
              {/*  Create and Delete */}
              <CustomBtn
                variant='createBtn'
                iconType='add'
                title='Create new user'
              >            
                Create
              </CustomBtn>
              <CustomBtn
                variant='deleteBtn'
                iconType='delete'
                title='Delete user'
              >           
                Delete
              </CustomBtn>
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
              <div>
                    <PermissionTree/>
                </div>
            </div>
      </div>
    )
};