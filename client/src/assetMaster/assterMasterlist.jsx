import Header from '../components/header';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import {top100Films} from './assetlist';
import EnhancedTable from './assetMasterTable';
import { NavLink } from 'react-router-dom';




function AssetMasterlist({setHeaderTitle}) {



  return (
    <div >
      {/* Filter Options */}
      <form className="flex w-full h-auto p-5">
      <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small"              
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Asset Number" />
          )}
          sx={{ width: '15rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small"              
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Asset" />
          )}
          sx={{ width: '25rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small"              
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Description" />
          )}
          sx={{ width: '25rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small"              
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Asset Group" />
          )}
          sx={{ width: '15rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small"              
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Brand" />
          )}
          sx={{ width: '15rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small" 
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Location" />
          )}
          sx={{ width: '15rem', marginRight: '1rem' }}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="size-small-filled-multi"
          size="small" 
          options={top100Films}
          getOptionLabel={(option) => option.title}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params}  placeholder="Department" />
          )}
          sx={{ width: '15rem', marginRight: '1rem' }}
        />   
        <TextField
          label="Created by"
          id="outlined-size-small"
          defaultValue=""
          size="small"
        />     
      </form>

      {/* Filter button */}
      <div className='flex w-full h-auto gap-0.5 p-2 pr-5 ml-auto bg-gray-100 place-content-end'>
        {/* Asset Group List Table to be implemented here */}
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-4 border border-solid rounded-full border-slate-900'
        >
          <ClearAllIcon/>
          Clear   
        </button>
        
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-4 text-white bg-green-400 rounded-full'
        >
          <CheckIcon/>  
          Go  
        </button>
        
      <NavLink to="/assetFolder/createAsset">
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-4 border border-solid rounded-full border-slate-900'
          onClick={() => setHeaderTitle('Create Asset')}
        >
          <AddIcon />
          Create
        </button>
      </NavLink>
      </div>

       {/* Filter table */}
       <div>
        <EnhancedTable />



       </div>
    </div>
  )
}

export default AssetMasterlist ;