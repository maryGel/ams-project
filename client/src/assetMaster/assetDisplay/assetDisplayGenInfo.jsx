import React from 'react';
import {
  Checkbox,
  FormControlLabel
}from '@mui/material';


export default function AssetDisplayGenInfo({asset, isEditing, onFieldChange }){


  return(
    <>
      <div  className='px-10'>
        <div className='py-5 text-base bg-gray-100 shadow-sm shadow-slate-200'>
          {/* General Information Fields */}
          <span className='pl-5 mb-5 text-blue-800'>General Information</span>
          <div key= {asset.id} className='flex gap-2 mt-2'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>UOM:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.Unit} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('Unit', e.target.value)}/>
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
          </div>

          {/* Item Assignment Fields*/}
          <span className='pl-5 text-blue-800'>Item Assignment</span>
          <div className='grid grid-cols-[10rem_1fr] mt-2 mb-8 mr-5 text-base gap-2'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Class:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.ItemClass} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('ItemClass', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Group:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.CATEGORY} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('CATEGORY', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Location:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.ItemLocation} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('ItemLocation', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Department:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value={asset.Department} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('Department', e.target.value)}/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Assigned to:</span>
            <input type= 'text' className='p-2 text-base text-gray-500' value='mcagulada' disabled={!isEditing} readOnly={!isEditing} onChange={(e) => onFieldChange('mcagulada', e.target.value)}/>
          </div>
          
          {/* Physical Count Information*/}
          <span className='pl-5 text-blue-800'>Physical Count Details</span>
          <div className='grid grid-cols-[15rem_1fr]  mt-2 ml-0 text-base'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Last physical count on:</span>
            <span className='p-2 text-base text-gray-500'>12/31/2024</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory count sheet:</span>
            <span className='p-2 text-base text-gray-500'>INV-TOWER1Manila</span>
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