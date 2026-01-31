import * as React from 'react';
import { useState, useMemo } from 'react';

// MUI import
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { createFilterOptions } from '@mui/material/Autocomplete';

// Component/pages import
import AssetMasterTable from '../assetMaster/assetMasterTable'
import { useAssetMasterData } from '../../hooks/assetMasterHooks';
import { useRefCategory } from '../../hooks/refCategory';
import { useRefItemClass } from '../../hooks/refClass';
import { useRefLocation } from '../../hooks/refLocation';
import { useRefDepartment } from '../../hooks/refDepartment';



function AssetMasterListPage({ useProps, setHeaderTitle, setNavLink }) {

  const {assets, isLoading, error, page, setPage, total} = useAssetMasterData();
  const {refCategoryData} = useRefCategory(useProps)
  const {refItemClassData} = useRefItemClass(useProps)
  const {refLocData} = useRefLocation(useProps)
  const {refDeptData} = useRefDepartment(useProps)

  // 1. INPUT STATE (What the user is typing/selecting now)
  const [draftSearchQuery, setDraftSearchQuery] = useState("");
  const [draftSelectedAssets, setDraftSelectedAssets] = useState([]); 
  const [draftSelectedAssetCategories, setDraftSelectedAssetCategories] = useState([]);
  const [draftSelectedAssetClass, setDraftSelectedAssetClass] = useState([]);
  const [draftSelectedLocation, setDraftSelectedLocation] = useState([]);
  const [draftSelectedDepartment, setDraftSelectedDepartment] = useState([]);

  // 2. COMMITTED FILTER STATE (What is used to filter data)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]); 
  const [selectedAssetCategory, setSelectedAssetCategory] = useState([]);
  const [selectedAssetClass, setSelectedAssetClass] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [filterKey, setFilterKey] = useState(0);

  // Table state
  const [selected, setSelected] = useState([]);

  const assetCat = useMemo(() => refCategoryData.map(item => item.category), [refCategoryData])
  const assetClass = useMemo(() => refItemClassData.map(item => item.itemClass), [refItemClassData])
  const location = useMemo(() => refLocData.map(item => item.LocationName), [refLocData])
  const department = useMemo(() => refDeptData.map(item => item.Department), [refDeptData])

  const isTableActive = searchQuery.trim() !== "" 
    || selectedAssets.length > 0 
    || selectedAssetCategory.length > 0 
    || selectedAssetClass.length > 0 
    || selectedLocation.length > 0 
    || selectedDepartment.length > 0; 
    
  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${option.FacNO} ${option.FacName} ${option.Description}`, // searchable text
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(item => {

      // 1. Filter by Search Text (free text search in Autocomplete or selected chips)
      const matchesText =
        searchQuery.trim() === "" ||
        item.FacNO?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.FacName?.toLowerCase().includes(searchQuery.toLowerCase());
    
      // 2. Filter by Selected Asset Chips (selections from the Asset Autocomplete)
      const matchesSelected =
        selectedAssets.length === 0 ||
        selectedAssets.some(sel => sel.FacNO === item.FacNO);

      // 3. Filter by Asset Category
      const matchesAssetCat = 
        selectedAssetCategory.length === 0 ||
        selectedAssetCategory.includes(item.CATEGORY); 
      // 4. Filter by Asset Class
      const matchesAssetClass = 
        selectedAssetClass.length === 0 ||
        selectedAssetClass.includes(item.ItemClass); 

      // 5. Filter by Location
      const matchesLocation = 
      selectedLocation.length === 0 ||
      selectedLocation.includes(item.ItemLocation); 

      // 6. Filter by Department
      const matchesDepartment = 
      selectedDepartment.length === 0 ||
      selectedDepartment.includes(item.Department); 

      return (matchesText && matchesSelected && matchesAssetCat && matchesAssetClass && matchesLocation && matchesDepartment);
    });
  }, [assets, searchQuery, selectedAssets, selectedAssetCategory, selectedAssetClass, selectedLocation, selectedDepartment]);


  const displayedAssets = isTableActive ? filteredAssets : [];

  const handleGoClick = () => {
    // Commit all draft states to the filter states
    setSearchQuery(draftSearchQuery);
    setSelectedAssets(draftSelectedAssets);
    setSelectedAssetCategory(draftSelectedAssetCategories);
    setSelectedAssetClass(draftSelectedAssetClass);
    setSelectedLocation(draftSelectedLocation);
    setSelectedDepartment(draftSelectedDepartment);
    setPage(0); //Reset Pagination
  }
  
  const handleClearClick = () => {
    // 1. Clear all Input/Draft states
    setDraftSearchQuery("");
    setDraftSelectedAssets([]);
    setDraftSelectedAssetCategories([]);
    setDraftSelectedAssetClass([]);
    setDraftSelectedLocation([]);
    setDraftSelectedDepartment([]);

    // 2. Clear all committed filter states
    setSearchQuery("");
    setSelectedAssets([]);
    setSelectedAssetCategory([]);
    setSelectedAssetClass([]);
    setSelectedLocation([]);
    setSelectedDepartment([]);

    setFilterKey(prevKey => prevKey);

    setPage(0); // Reset pagination
    setSelected([]); //Clear the selected rows
  }


  return (
    <div >

      {/* ... F i l t e r  O p t i o n ... */}

      <form className="flex w-full h-auto p-5">
          <Autocomplete
            key = {`asset-search-${filterKey}`}
            multiple
            limitTags={1}
            size="small"  
            options={assets}
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
              <li {...props} key={option.FacNO} >
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

          {/* Asset Group Search */}
          <Autocomplete
            key = {`assetgrp-search-${filterKey}`}
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={assetCat}
            // Use draft state for asset group
              value={draftSelectedAssetCategories}
              onChange={(event, newValue) => setDraftSelectedAssetCategories(newValue)} 
              getOptionLabel={(option) => option}
            // defaultValue={[]}
              renderInput={(params) => (
                <TextField {...params} label="Asset Group" placeholder="Asset Group" />
              )}
            sx={{ width: '15rem', marginRight: '1rem' }}
          />

          {/* Asset Class Search  */}
          <Autocomplete
            key = {`assetclass-search-${filterKey}`}
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={assetClass}  
            // Use draft state for asset group
            value={draftSelectedAssetClass}
            onChange={(event, newValue) => setDraftSelectedAssetClass(newValue)}

            getOptionLabel={(option) => option}
            // defaultValue={[]}
            renderInput={(params) => (
              <TextField {...params} label="Asset Class"  placeholder="Asset Class" />
            )}
            sx={{ width: '15rem', marginRight: '1rem' }}
          />

          {/* Location Search  */}
          <Autocomplete
            key = {`location-search-${filterKey}`}
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={location}  
            // Use draft state for asset group
            value={draftSelectedLocation}
            onChange={(event, newValue) => setDraftSelectedLocation(newValue)}

            getOptionLabel={(option) => option}
            // defaultValue={[]}
            renderInput={(params) => (
              <TextField {...params} label="Location"  placeholder="Location" />
            )}
            sx={{ width: '15rem', marginRight: '1rem' }}
          />
          {/* Department Search */}
          <Autocomplete
            key = {`department-search-${filterKey}`}
            multiple
            limitTags={1}
            id="size-small-filled-multi"
            size="small"              
            options={department}  
            // Use draft state for asset group
            value={draftSelectedDepartment}
            onChange={(event, newValue) => setDraftSelectedDepartment(newValue)}

            getOptionLabel={(option) => option}
            // defaultValue={[]}
            renderInput={(params) => (
              <TextField {...params} label="Department"   placeholder="Department" />
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
        
      
      
      {/* ...  B u t t o n s ... */}
      

      <div className='flex w-full h-auto p-2 pr-5 ml-auto bg-gray-100 place-content-end'>
        {/* Asset Group List Table to be implemented here */}
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-2 text-white transition-transform duration-200 ease-in-out bg-green-500 border rounded-full shadow-black border-spacing-1 active:scale-95 hover:text-gray-600'
          onClick={handleGoClick} 
          type="button"
        >
          <CheckCircleIcon sx={{marginX: .5}} />  
          Go  
        </button>
        <button 
          className='pt-1 pb-1 pl-2 pr-3 mr-2 text-gray-600 transition-transform duration-200 ease-in-out border rounded-full border-slate-300 active:scale-95 hover:bg-gray-600 hover:text-white '
          onClick={handleClearClick}
          type="button" // Use this to prevent form submission
        >
          <ClearAllIcon/>
          Clear   
        </button>
      </div>

       {/* Filter table */}
      <div>
        <AssetMasterTable 
          loading = {isLoading}
          error = {error}
          page = {page}
          total = {total}
          setPage = {setPage}
          displayedAssets = {displayedAssets}
          searchQuery={searchQuery}  
          isTableActive={isTableActive}
          setHeaderTitle={setHeaderTitle}
          setNavLink={setNavLink}
          selected = {selected}
          setSelected = {setSelected}
        />
      </div>
    </div>
  )
}

export default AssetMasterListPage ;