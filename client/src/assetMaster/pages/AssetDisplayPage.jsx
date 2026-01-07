import React, {useState, useEffect} from 'react'
import AssetDisplayTabs from '../assetDisplay/assetDisplayTabs'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import { useAssetMasterData } from '../../hooks/assetMasterHooks';


export default function AssetMasterDisplay(){

  // State to hold API Asset data
  const { itemList, loading, error } = useAssetMasterData(); 
  const { facno } = useParams();
  const [asset, setAsset] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  console.log( `facno: ${facno}`)


  // Fetch Asset data from API on component mount
  useEffect(() => {

    if (!itemList || itemList.length === 0) return;
    // Clean the route facno
    const targetFacNoClean = facno?.replace(/\s/g, '').toUpperCase();    
    const matchingAsset = itemList.find(item => {
      if (!item.FacNO || typeof item.FacNO !== 'string') return false;
      const itemFacNoClean = item.FacNO
        .replace(/\u00A0/g, '')   // Remove NBSP
        .replace(/\s/g, '')       // Remove normal whitespace
        .toUpperCase();
      return itemFacNoClean === targetFacNoClean;
    });
    setAsset(matchingAsset || {});
    
  }, [itemList, facno]);

  const handleEditButton = () => {
    setIsEditing(prev => !prev)
  }

  const handleChange = (field, value) => {
    setAsset(prev => ({
      ...prev,
      [field]: value
    }));
  };

  

  if (loading) return <p className="p-5">Loading asset...</p>;
  if (error) return <p className="p-5 text-red-600">Error loading asset data.</p>;

  return(
    <>
      <div className='grid px-10 py-3 mx-32'>
          {/* ----------------
          -  B U T T O N S   -
          -------------------*/}
          {/* Edit Button */}          
          <div className='flex justify-end gap-2 mt-8 mb-3'>
            
            {/* SAVE BUTTON */}
            {isEditing && (
              <IconButton
                title='Save Changes'
                color="primary"
                sx={{ border: 1 }}
                // onClick={handleSave}
              >
                <SaveIcon />
              </IconButton>
            )}
            
            {/* EDIT and CANCEL BUTTON */}
              <IconButton
                title='Edit Asset'
                sx={{ border: 1 }}
                type="button" // Use this to prevent from submission
                onClick={handleEditButton}
              >
                {isEditing ? 
                  <CancelIcon  size ="small"/> :
                  <BorderColorIcon  size ="small" />
                }
              </IconButton>
          </div>


          {/* ------------------
          -    F I E L D S     -
          ---------------------*/}
      
          <div  className='mb-1'>
            <p className='p-3 pl-16 font-medium tracking-wide bg-white border rounded-md shadow-md text-normal shadow-slate-300 border-slate-300 text-slate-800'
            >Asset Number: {asset.FacNO}</p>
    
            <div className='grid grid-cols-[2fr_1fr] mt-3 py-2 shadow-md shadow-slate-300 bg-white border rounded-md border-slate-300 text-slate-800'>
              {/* Column 1: Asset Name and Description */}
              <div className='mt-3'>
                <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-2 text-base bg-gray-100'>
                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Name:</span>
                  <input type="text" className='p-2 mr-5 text-base' disabled={!isEditing} value={asset.FacName || ''}  onChange={(e) => handleChange('FacName', e.target.value)}/>
                </div>
                <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-2 text-base bg-gray-100'>
                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Description:</span>
                  <input type="text" className='p-2 mr-5 text-base'  disabled={!isEditing} value={asset.Description || ''} readOnly={!isEditing} onChange={(e) => handleChange('Description', e.target.value)}/>
                </div>  
                <div className='grid grid-cols-[10rem_2fr] shadow-sm shadow-slate-200 mt-2 ml-16 py-2 text-base bg-gray-100'>
                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Status:</span>
                  <input type="text" className='p-2 text-base font-semibold tracking-wider text-green-600' disabled value={asset.xStatus || 'Active'} readOnly />
                </div>          
              </div>
    
              {/* Column 2: Display Photo */}
              <div className='flex justify-center p-2 m-2 mx-20 border border-green-900 shadow-md shadow-slate-200'>
                <img 
                  // className='h-30 w-30'
                  src='/public/images/assets/laptop.jpg'
                />
              </div>
            </div>      
          </div>
  
        <AssetDisplayTabs
          asset={asset}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onFieldChange={handleChange}
        />
      </div>  
    </>
  )
}