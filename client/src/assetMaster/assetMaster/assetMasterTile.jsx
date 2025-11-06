import React from 'react';
import { NavLink } from 'react-router-dom';
import { assetTileList } from '../hooks/assetTilelist';


function AssetMasterTile({setHeaderTitle}) {



  return (
    <div className='grid items-start w-full h-full grid-cols-10 gap-1'>

      {assetTileList.map((asset) => (
        <div key= {asset.id} className='flex flex-col items-center justify-center w-full h-full'>
          <NavLink  to = {asset.link} >
            <button className='w-32 h-32 p-4 mb-3 bg-white border border-blue-800 border-solid rounded-lg shadow-lg text-slate-800 group hover:shadow-none hover:border-gray-800 hover:bg-slate-700'
              onClick={() => setHeaderTitle(asset.headerTitle)}
            >
              <img src = {asset.imgSrc} alt= {asset.title} />
            </button>
            <h2 className='text-base tracking-wider text-center'>
              {asset.title}
            </h2> 
          </NavLink>
        </div>
      ))}
    
    </div>
  )
}

export default AssetMasterTile ;