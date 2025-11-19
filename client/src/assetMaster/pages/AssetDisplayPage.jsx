import React, {useState, useEffect} from 'react'
import AssetDisplayTabs from '../assetDisplay/assetDisplayTabs'
import GroupBtns from '../../components/groupbtns'
import { useParams } from 'react-router-dom';


export default function AssetMasterDisplay(){

  // State to hold API Asset data
  const [asset, setAsset] = useState({});
  const { facno } = useParams();

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
        const targetFacNo = facno;
        console.log(facno)

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
  },[facno]);


  return(
    <>
      <div className='flex justify-end m-2 mr-10'>
        {/* Primary Button */}
        <GroupBtns onClick={() => console.log('Clicked Primary')}>
          Edit
        </GroupBtns>
      </div>

      {/* Asset Display Detials */}
      <div className='grid p-5 border rounded-lg border-spacing-x-3 bg-gray-50'>
       
            <div  className='mb-1'>
              <p className='p-3 pl-16 font-medium tracking-wide bg-white border rounded-md shadow-md text-normal shadow-slate-300 border-slate-300 text-slate-800'
              >Asset Number: {asset.FacNO}</p>
      
              <div className='grid grid-cols-[2fr_1fr] mt-3 py-2 shadow-md shadow-slate-300 bg-white border rounded-md border-slate-300 text-slate-800'>
                {/* Column 1: Asset Name and Description */}
                <div className='mt-3'>
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-1 text-base bg-gray-50'>
                    <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Name:</span>
                    <input type="text" className='p-2 text-base' disabled value={asset.FacName || ''} readOnly />
                  </div>
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-1 text-base bg-gray-50'>
                    <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Description:</span>
                    <input type="text" className='p-2 text-base' disabled value={asset.Description || ''} readOnly />
                  </div>  
                  <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-2 text-base bg-gray-50'>
                    <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Status:</span>
                    <input type="text" className='p-2 text-base font-semibold tracking-wider text-green-600' disabled value={asset.xStatus || 'Active'} readOnly />
                  </div>          
                </div>
      
                {/* Column 2: Display Photo */}
                <div className='flex justify-center p-2 m-2 border border-green-900 shadow-md mr-28 ml-36 shadow-slate-200'>
                  <img 
                    // className='h-30 w-30'
                    src='/public/images/assets/laptop.jpg'
                  />
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