import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function AssetDisplayGenInfo({asset}){

  return(
    <>
      <div className='p-5'>
        <div className='pt-5 pb-5 text-base shadow-sm shadow-slate-200 bg-gray-50'>
          {/* General Information Fields */}
          <p className='pl-5 mb-2 text-blue-800'>General Information</p>
          <div className='flex'>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>UOM:</p>
            <p className='p-2 text-base'>{asset.Unit}</p>
            <p className='p-2 pl-10 text-base tracking-wider text-gray-500'>Quantity:</p>
            <p className='p-2 text-base font-semibold'>{asset.balance_unit}</p>       
          </div>
          <div className='grid grid-cols-[10rem_1fr] mt-5 ml-0 text-base bg-gray-50'>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Brand:</p>
            <p className='p-2 text-base'>{asset.brand}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Serial Number:</p>
            <p className='p-2 text-base'>{asset.serialNo}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Supplier:</p>
            <p className='p-2 text-base'>{asset.suppName}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Reference:</p>
            <p className='p-2 text-base'>{asset.ReferenceNo}</p>
          </div>

          {/* Item Assignment Fields*/}
          <p className='pl-5 mt-5 text-blue-800'>Item Assignment</p>
          <div className='grid grid-cols-[10rem_1fr] mb-5 mt-5 ml-0 text-base bg-gray-50'>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Class:</p>
            <p className='p-2 text-base'>{asset.ItemClass}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Group:</p>
            <p className='p-2 text-base'>{asset.CATEGORY}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Location:</p>
            <p className='p-2 text-base'>{asset.ItemLocation}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Department:</p>
            <p className='p-2 text-base'>{asset.Department}</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Assigned to:</p>
            <p className='p-2 text-base'>mcagulada</p>
          </div>
          <hr/>
          {/* Physical Count Information*/}
          <p className='pl-5 mt-5 text-blue-800'>Physical Count Details</p>
          <div className='grid grid-cols-[15rem_1fr]  mt-5 ml-0 text-base bg-gray-50'>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Last physical count on:</p>
            <p className='p-2 text-base'>12/31/2024</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory count sheet:</p>
            <p className='p-2 text-base'>INV-TOWER1Manila</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory note:</p>
            <p className='p-2 text-base'>Needs to evaluate for repair</p>
            <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Counted by:</p>
            <p className='p-2 text-base'>Andrea</p>
            <div className='flex items-center ml-2'>
              <Checkbox />
              <p className='p-2 text-base tracking-wider text-gray-500'>Flag for Deletion</p>
            </div>
          </div>
        </div>

      </div>
    
    
    </>
  )
}