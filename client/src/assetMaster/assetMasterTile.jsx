import React from 'react';
import { NavLink } from 'react-router-dom';


function AssetMasterTile({setHeaderTitle}) {



  return (
    <div className='grid items-start w-full h-full grid-cols-10 gap-1'>

    <div className='flex flex-col items-center justify-center w-full h-full'>
      <NavLink to="/assetFolder/assetMasterData">
        <button className='w-32 h-32 p-4 mb-3 bg-white border border-blue-800 border-solid rounded-lg shadow-lg hover:shadow-none hover:border-red-800'
          onClick={() => setHeaderTitle('Asset Master List')}
        >
          <img src="/public/icons/menu_icons/asset.png" alt="Asset Master" />
        </button>
        <h2 className='text-base tracking-wider text-center'>
          Asset Master
        </h2>
      </NavLink>
    </div>

    <div className='flex flex-col items-center justify-center w-full h-full'>
      <NavLink to="/assetFolder/assetGrouplist">
        <button className='w-32 h-32 p-4 mb-3 bg-white border border-blue-800 border-solid rounded-lg shadow-lg hover:shadow-none hover:border-red-800'
          onClick={() => setHeaderTitle('Asset Group List')}
        >
          <img src="/public/icons/menu_icons/assets.png" alt="Asset Group" />
        </button>
        <h2 className='text-base tracking-wider text-center'>
          Asset Group
        </h2>
      </NavLink>
    </div>


    </div>
  )
}

export default AssetMasterTile ;