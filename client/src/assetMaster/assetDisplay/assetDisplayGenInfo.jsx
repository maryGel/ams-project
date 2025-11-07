import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function AssetDisplayGenInfo({asset}){

  return(
    <>
      <div  className='p-5'>
        <div className='pt-5 pb-5 text-base shadow-sm shadow-slate-200 bg-gray-50'>
          {/* General Information Fields */}
          <span className='pl-5 mb-2 text-blue-800'>General Information</span>
          <div key= {asset.id} className='flex mt-5'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>UOM:</span>
            <input type= 'text' className='p-2 text-base' value={asset.Unit} disabled/>
            <span className='p-2 pl-10 text-base tracking-wider text-gray-500'>Quantity:</span>
            <input type= 'text' className='p-2 text-base' value={asset.balance_unit} disabled/>
          </div>
          <div className='grid grid-cols-[10rem_1fr] mt-5 ml-0 text-base bg-gray-50'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Brand:</span>
            <input type= 'text' className='p-2 text-base' value={asset.brand} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Serial Number:</span>
            <input type= 'text' className='p-2 text-base' value={asset.serialNo} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Supplier:</span>
            <input type= 'text' className='p-2 text-base' value={asset.suppName} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Reference:</span>
            <input type= 'text' className='p-2 text-base' value={asset.ReferenceNo} disabled/>
          </div>

          {/* Item Assignment Fields*/}
          <span className='pl-5 mt-5 text-blue-800'>Item Assignment</span>
          <div className='grid grid-cols-[10rem_1fr] mb-5 mt-5 ml-0 text-base bg-gray-50'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Class:</span>
            <input type= 'text' className='p-2 text-base' value={asset.ItemClass} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Group:</span>
            <input type= 'text' className='p-2 text-base' value={asset.CATEGORY} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Location:</span>
            <input type= 'text' className='p-2 text-base' value={asset.ItemLocation} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Department:</span>
            <input type= 'text' className='p-2 text-base' value={asset.Department} disabled/>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Assigned to:</span>
            <span className='p-2 text-base'>mcagulada</span>
          </div>
          
          {/* Physical Count Information*/}
          <span className='pl-5 mt-5 text-blue-800'>Physical Count Details</span>
          <div className='grid grid-cols-[15rem_1fr]  mt-5 ml-0 text-base bg-gray-50'>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Last physical count on:</span>
            <span className='p-2 text-base'>12/31/2024</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory count sheet:</span>
            <span className='p-2 text-base'>INV-TOWER1Manila</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Inventory note:</span>
            <span className='p-2 text-base'>Needs to evaluate for repair</span>
            <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Counted by:</span>
            <span className='p-2 text-base'>Andrea</span>
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