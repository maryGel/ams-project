import Header from '../../components/header';
import * as React from 'react';

// MUI import
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { createFilterOptions } from '@mui/material/Autocomplete';


//Component/pages import
import {top100Films} from '../hooks/assetlist';
import AssetMasterTable from '../assetMaster/assetMasterTable'
import { NavLink } from 'react-router-dom';
import { useAssetMasterData } from '../../hooks/assetMasterHooks';
import { useRefCategory } from '../../hooks/refCategory';
 




function AssetMasterListPage({useProps, setHeaderTitle}) {

  const {itemList} = useAssetMasterData(useProps);
  const {refCategoryData} = useRefCategory(useProps)
  console.log(refCategoryData)

  const assetGrp = refCategoryData.map(item => item.category)
 
  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.FacNO} ${option.FacName} ${option.Description}`, // searchable text
  });
  



  return (
    <div >
      {/* Filter Options */}
      <form className="flex w-full h-auto p-5">
          <Autocomplete
            multiple
            limitTags={1}
            size="small"  
            options={itemList}
            filterOptions={filterOptions}
            getOptionLabel={(option) =>
              `${option.FacNO} - ${option.FacName}`
            }
            renderOption={(props, option) => (
              <li {...props} key={option.FacNO}>
                <div>
                  <strong>{option.FacNO}</strong> - {option.FacName}
                  <br />
                  <small>{option.Description}</small>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Search Assets" placeholder="Search" />
            )}
            sx={{ width: 500, marginRight: '1rem' }}
            // optional: multiple selection
            // multiple
            // limitTags={1}
            // defaultValue={[]}
          />
       
          <Autocomplete
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={assetGrp}
            // filterOptions={filterOptions}
            getOptionLabel={(option) => option}
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
      
      {/* Filter buttons */}
      <div className='flex w-full h-auto p-2 pr-5 ml-auto bg-gray-100 place-content-end'>
        {/* Asset Group List Table to be implemented here */}
        <button className='pt-1 pb-1 pl-2 pr-3 mr-2 text-gray-600 border rounded-full shadow-md border-slate-300'>
          <ClearAllIcon/>
          Clear   
        </button>
        
        <button className='pt-1 pb-1 pl-2 pr-3 mr-2 text-green-100 bg-green-500 border border-green-400 rounded-full shadow-lg'>
          <CheckIcon/>  
          Go  
        </button>
        
        <NavLink to="/assetFolder/createAsset">
          <button 
            className='pt-1 pb-1 pl-2 pr-3 mr-4 text-gray-600 border rounded-full shadow-md border-slate-300'
            onClick={() => setHeaderTitle('Create Asset')}
          >
            <AddIcon />
            Create
          </button>
        </NavLink>
      </div>

       {/* Filter table */}
      <div>
        <AssetMasterTable 
        />
      </div>
    </div>
  )
}

export default AssetMasterListPage ;