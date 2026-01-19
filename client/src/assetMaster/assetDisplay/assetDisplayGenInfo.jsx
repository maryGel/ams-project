import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField
}from '@mui/material';
import { getAutocompleteSx } from '../../Utils/autocompleteStyles';  
// Custom Hooks
import { useRefUom } from '../../hooks/refUom'; 
import { useRefItemClass } from '../../hooks/refClass';
import { useRefCategory } from '../../hooks/refCategory';
import { useRefDepartment } from '../../hooks/refDepartment'; 
import { useRefLocation } from '../../hooks/refLocation'; 



export default function AssetDisplayGenInfo({useProps, asset, isEditing, onFieldChange }){

  const { uomData } = useRefUom(useProps);
  const { refCategoryData } = useRefCategory(useProps);
  const { refItemClassData } = useRefItemClass(useProps);
  const { refDeptData } = useRefDepartment(useProps);
  const { refLocData } = useRefLocation(useProps);



  return(
    <>
      <div  className='px-10'>
        <div className='py-5 text-base bg-gray-100 shadow-sm shadow-slate-200'>
          {/* General Information Fields */}
          <span className='pl-5 mb-5 text-blue-800'>General Information</span>
          <div key= {asset.id} className='flex gap-2 mt-2'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>UOM:</span>
            <Autocomplete 
              disabled={!isEditing} 
              sx={{width: '10rem'}}
              size = 'small'
              options= {uomData.map(item => item.Unit)} 
              value={asset.Unit || ''}  
              onChange={(event, newValue) => onFieldChange('Unit', newValue)}
              renderInput={(params) => (
                <TextField {...params} 
                  sx={getAutocompleteSx(isEditing)}
                />              
              )} 
            />
            <span className='p-2 pl-10 text-base tracking-wider text-gray-500'>Quantity:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.balance_unit} disabled={!isEditing}  onChange={(e) => onFieldChange('balance_unit', e.target.value)}/>
            <FormControlLabel
              control={
                <Checkbox
                  checked={asset.writeOff} sx={{ color: 'Blue'}} onChange={(e) => onFieldChange("writeOff",e.target.checked ? 1: 0)}        
                />
              }
              disabled={!isEditing}
              label="Write-Off"
              sx={{ color: 'gray', marginX: ".2rem" }}
            />
          </div>
          <div className='grid grid-cols-[10rem_1fr] mt-2 mb-8 mr-5 text-base gap-2'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Brand:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.Brand} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('Brand', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Serial Number:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.serialNo} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('serialNo', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Supplier:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.suppName} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('suppName', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Reference:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.ReferenceNo} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('ReferenceNo', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Color:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.Color} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('ReferenceNo', e.target.value)}/>

          </div>

          {/* Item Assignment Fields*/}
          <span className='pl-5 text-blue-800'>Item Assignment</span>
          <div className='grid grid-cols-[10rem_1fr] mt-2 mb-8 mr-5 text-base gap-2'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Group:</span>
            <Autocomplete 
              disabled={!isEditing} 
              size = 'small'
              options= {refCategoryData.map(item => item.category)} 
              value={asset.CATEGORY || ''}  
              onChange={(event, newValue) => onFieldChange('Category', newValue)}
              renderInput={(params) => (
                <TextField {...params} 
                  sx={getAutocompleteSx(isEditing)}
                />              
              )} 
            />
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Class:</span>
            <Autocomplete 
              disabled={!isEditing} 
              size = 'small'
              options= {refItemClassData.map(item => item.itemClass)} 
              value={asset.ItemClass || ''}  
              onChange={(event, newValue) => onFieldChange('Class', newValue)}
              renderInput={(params) => (
                <TextField {...params} 
                  sx={getAutocompleteSx(isEditing)}
                />              
              )} 
            />
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Department:</span>
            <Autocomplete 
              disabled={!isEditing} 
              size = 'small'
              options= {refDeptData.map(item => item.Department)} 
              value={asset.Department || ''}  
              onChange={(event, newValue) => onFieldChange('Category', newValue)}
              renderInput={(params) => (
                <TextField {...params} 
                  sx={getAutocompleteSx(isEditing)}
                />              
              )} 
            />
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Location:</span>
            <Autocomplete 
              disabled={!isEditing} 
              size = 'small'
              options= {refLocData.map(item => item.LocationName)} 
              value={asset.ItemLocation || ''}  
              onChange={(event, newValue) => onFieldChange('Category', newValue)}
              renderInput={(params) => (
                <TextField {...params} 
                  sx={getAutocompleteSx(isEditing)}
                />              
              )} 
            />
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Assigned to:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.Holder} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('mcagulada', e.target.value)}/>
            <box className='flex justify-between gap-2 w-100'>
              <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Warranty:</span>
              <span className='p-2 pl-5 mr-4 text-base tracking-wider text-gray-500'>From</span>
              <input type= 'date' className='p-2 text-base text-gray-500' value={asset.StartDate} disabled={!isEditing} readOnly={!isEditing} />
              <span className='p-2 pl-5 mr-4 text-base tracking-wider text-gray-500'>to</span>
              <input type= 'date' className='p-2 text-base text-gray-500' value={asset.EndDate} disabled={!isEditing} readOnly={!isEditing} />
            </box>
          </div>
          
          {/* Physical Count Information*/}
          <span className='pl-5 text-blue-800'>Physical Count Details</span>
          <div className='grid grid-cols-[15rem_1fr]  mt-2 ml-0 text-base'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Last physical count on:</span>
            <span className='p-2 text-base text-gray-500'>12/31/2024</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory count sheet:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.PC_BATCH} disabled readOnly/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory note:</span>
            <span className='p-2 text-base text-gray-500'>Needs to evaluate for repair</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Counted by:</span>
            <span className='p-2 text-base text-gray-500'>Andrea</span>
            <div className='flex items-center ml-2'>
              <Checkbox />
              <span className='p-2 text-base tracking-wider text-gray-500'>Flag for Deletion</span>
            </div>
          </div>
        </div>
      </div>   
    </>
  )
}