import React, {useState, useEffect} from 'react'
import AssetDisplayTabs from './assetDisplayTabs'
import GroupBtns from '../components/groupbtns'


export default function AssetMasterDisplay({selectedItem}){

  // State to hold API Asset data
  const [asset, setAsset] = useState({});
  const targetFacNo = localStorage.getItem('selectedFacNO');
  console.log("Target FacNO in AssetMasterDisplay:", targetFacNo);




  // Fetch Asset data from API on component mount
  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await fetch(('/api/itemlist/assetMasterlist')); 
          if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json()

        
          // Set your clean target value
        const targetFacNo = localStorage.getItem('selectedFacNO');
        console.log("Target FacNO in AssetMasterDisplay:", targetFacNo);

        const matchingAssets = data.filter(item => {            
            // Ensure FacNo exists and is a string before attempting to clean
            if (typeof item.FacNO !== 'string') {
                return false;
            }
        
                // 1. Replace the Non-Breaking Space (U+00A0) and all other whitespace (\s) globally.
                // 2. Convert to uppercase for case-insensitive matching (optional but recommended).
                const itemFacNoClean = item.FacNO
                    .replace(/\u00A0/g, '') // Explicitly remove Non-Breaking Space (U+00A0)
                    .replace(/\s/g, '')    // Remove all standard whitespace
                    .toUpperCase();
                    
                // Clean the target value just in case
                const targetFacNoClean = targetFacNo.replace(/\s/g, '').toUpperCase();
                
                const isMatch = itemFacNoClean === targetFacNoClean;


                // You can remove this console.log now that we've diagnosed the issue

                return isMatch;
                });
        

            const targetAsset = matchingAssets.length > 0 ? matchingAssets[0] : undefined;
            if (targetAsset) {
                // 💡 The linter often flags targetAsset here because its value 
                // is only used within this conditional block.
                // However, it is used here:
                setAsset(targetAsset); 
            } else {
                // ...
            }
          
      } catch (error) {
        console.error('Error fetching asset data:', error);
      } finally {
        console.log('Fetch attempt finished.');
      }
    };
    fetchAssetData();
  },[selectedItem]);


  return(
    <>
      <div className='flex justify-end m-5 mr-10'>
        {/* Primary Button */}
        <GroupBtns onClick={() => console.log('Clicked Primary')}>
          Edit
        </GroupBtns>
      </div>

      {/* Asset Display Detials */}
      <div className='grid p-10 border rounded-lg border-spacing-x-3 bg-gray-50'>
       
            <div  className='mb-10'>
              <p className='p-3 pl-16 text-xl font-medium tracking-wide bg-white border rounded-md shadow-md shadow-slate-300 border-slate-300 text-slate-800'
              >Asset Number: {asset.FacNO}</p>
      
              <div className='grid grid-cols-[2fr_1fr] mt-10 shadow-md shadow-slate-300 bg-white border rounded-md border-slate-300 text-slate-800'>
                {/* Column 1: Asset Name and Description */}
                <div className='mt-10'>
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
                    <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Name:</p>
                    <p className='p-2 text-base font-semibold'>{asset.FacName}</p>
                  </div>
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
                    <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Description:</p>
                    <p className='p-2 text-base'>{asset.Description}</p>
                  </div>  
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-5 ml-16 text-base bg-gray-50'>
                    <p className='p-2 pl-5 text-base tracking-wider text-gray-500'>Status:</p>
                    <p className='p-2 text-base font-semibold tracking-wider text-green-600'>Active</p>
                  </div>          
                </div>
      
                {/* Column 2: Display Photo */}
                <div className='flex justify-center p-5 m-10 ml-20 mr-20 border border-green-900 shadow-md shadow-slate-200'>
                  <img 
                    className='h-60 w-100'
                    src='/public/images/assets/laptop.jpg'/>
                </div>
              </div>      
            </div>
  
        <AssetDisplayTabs
            asset={asset}
        />
      </div>  
    </>
  )
}