import React from 'react';


// import pages to send props to change header title accordingly
// import AssetMasterlist from '../assetMaster/assterMasterlist';
import AssetMasterTile from '../assetMaster/assetMasterTile';


function Header( {headerTitle, setHeaderTitle} ) {


  const updateHeaderTitle = (newTitle) => { 
    setHeaderTitle(newTitle);
  }

  return (
    <>
      <header
        className="flex items-center p-2 pl-6 tracking-wider text-black bg-blue-100"      
      >
        <button
          onClick={() => updateHeaderTitle('Asset Management System')}
        >
          <img src="/icons/actions/home.png" alt="Home" 
            className="w-6 h-6 mr-4"
          />
        </button>

        <h1>{headerTitle}</h1>
        
        <div
          className="flex ml-auto mr-6 space-x-6 place-items-center"
        >
          <button>
            <img src="/icons/actions/search.png" alt="Notifications" 
              className="w-6 h-6 mr-32"
            />
          </button>
          <button>
            <img src="/icons/actions/recent.png" alt="Notifications" 
              className="w-6 h-6"
            />
          </button>
          <button>
            <img src="/icons/actions/notification.png" alt="Notifications" 
              className="w-6 h-6"
            />
          </button>
          <button>
            <img src="/icons/actions/user.png" alt="User" 
              className="w-6 h-6"
            />
          </button>
        </div>
  {/* 
        <AssetMasterlist
          setDefHeader={setDefHeader}
        /> */}


      </header>
    </>
    
  );
}

export default Header;