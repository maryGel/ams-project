import Header from '../../components/header';
import * as React from 'react';
import { useState } from 'react';

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

  const {itemList, loading, error} = useAssetMasterData(useProps);
  const {refCategoryData} = useRefCategory(useProps)

  // 1. INPUT STATE (What the user is typing/selecting now)
  const [draftSearchQuery, setDraftSearchQuery] = useState("");
  const [draftSelectedAssets, setDraftSelectedAssets] = useState([]); 
  const [draftSelectedAssetGroups, setDraftSelectedAssetGroups] = useState([]);

  // 2. COMMITTED FILTER STATE (What is used to filter data)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]); 
  const [selectedAssetGroups, setSelectedAssetGroups] = useState([]);
  const [filterKey, setFilterKey] = useState(0);

  // Table state
  const [page, setPage] = useState(0);
  

  const assetGrp = refCategoryData.map(item => item.category)

  const isTableActive = searchQuery.trim() !== "" || selectedAssets.length > 0 || selectedAssetGroups.length > 0; // Flag to control when data is displayed
 
 
  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.FacNO} ${option.FacName} ${option.Description}`, // searchable text
  });

  const getFilteredAsset = itemList.filter(item => {

    // 1. Filter by Search Text (free text search in Autocomplete or selected chips)
    const matchesText =
      searchQuery.trim() === "" ||
      item.FacNO?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.FacName?.toLowerCase().includes(searchQuery.toLowerCase());
  
    // 2. Filter by Selected Asset Chips (selections from the Asset Autocomplete)
    const matchesSelected =
      selectedAssets.length === 0 ||
      selectedAssets.some(sel => sel.FacNO === item.FacNO);

    // 3. ➡️ NEW: Filter by Asset Group
    const matchesAssetGroup = 
      selectedAssetGroups.length === 0 ||
      selectedAssetGroups.includes(item.CATEGORY); // Assuming item.CATEGORY holds the Asset Group value
  
    return matchesText && matchesSelected && matchesAssetGroup;
  });
  

  const displayedAsset = isTableActive ? getFilteredAsset : [];

  const handleGoClick = () => {
    // Commit all draft states to the filter states
    setSearchQuery(draftSearchQuery);
    setSelectedAssets(draftSelectedAssets);
    setSelectedAssetGroups(draftSelectedAssetGroups);
    setPage(0); //Reset Pagination
  }
  
  const handleClearClick = () => {
    // 1. Clear all Input/Draft states
    setDraftSearchQuery("");
    setDraftSelectedAssets([]);
    setDraftSelectedAssetGroups([]);

    // 2. Clear all committed filter states
    setSearchQuery("");
    setSelectedAssets([]);
    setSelectedAssetGroups([]);

    setFilterKey(prevKey => prevKey);

    setPage(0); // Reset pagination
  }

  return (
    <div >
      {/* Filter Options */}
      <form className="flex w-full h-auto p-5">
          <Autocomplete
            key = {`asset-search-${filterKey}`}
            multiple
            limitTags={1}
            size="small"  
            options={itemList}
            filterOptions={filterOptions}

            // Selected items 
            value={draftSelectedAssets}
            onChange={(event, newValue) => setDraftSelectedAssets(newValue)}

            //  free text search
            inputValue= {draftSearchQuery}
            onInputChange = {(event, newInputValue) => setDraftSearchQuery(newInputValue)}


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
          />
       
          <Autocomplete
            key = {`asset-search-${filterKey}`}
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={assetGrp}
            // Use draft state for asset group
            value={draftSelectedAssetGroups}
            onChange={(event, newValue) => setDraftSelectedAssetGroups(newValue)}

            getOptionLabel={(option) => option}
            // defaultValue={[]}
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
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-2 text-gray-600 border rounded-full shadow-md border-slate-300'
          onClick={handleClearClick}
          type="button" // Use this to prevent form submission
        >
          <ClearAllIcon/>
          Clear   
        </button>
        
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-2 text-green-100 bg-green-500 border border-green-400 rounded-full shadow-lg'
          onClick={handleGoClick} 
          type="button"
        >
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
          itemList = {itemList}
          loading = {loading}
          error = {error}
          page = {page}
          setPage = {setPage}
          displayedAsset = {displayedAsset}
          searchQuery={searchQuery}  
          isTableActive={isTableActive}
        />
      </div>
    </div>
  )
}

export default AssetMasterListPage ;