import {useState, useEffect} from 'react'

// MUI
import {Snackbar, Alert} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { useAssetMasterData } from '../../hooks/assetMasterHooks';
// Custom Hooks
import { useRefUom } from '../../hooks/refUom'; // import the refUnit data
import { useSearchParams } from 'react-router-dom';
import { assetMasterFields, prepareAssetPayload } from '../createAsset/assetMasterFields';
// Components
import AssetDisplayTabs from '../assetDisplay/assetDisplayTabs'


export default function AssetMasterDisplay({}){

  // State to hold API Asset data
  const { 
    assets, 
    singleAsset,
    fetchAssetByFacN0,
    clearSingleAsset,
    updateAsset,
    isLoading, 
    isMutating,
    isLoadingSingle, 
    error
  } = useAssetMasterData(); 
  
  // State variables
  const [ searchParams ] = useSearchParams();
  const [ asset, setAssetData ] = useState({assetMasterFields});
  const [ isEditing, setIsEditing ] = useState(false);
  const [ saveError, setSaveError ] = useState(null);
  const [ snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const copyFacN0 = searchParams.get('copyFrom');  

  // Fetch Asset data from API on component mount
  useEffect(() => {
    if(copyFacN0){
      fetchAssetByFacN0(copyFacN0);
    } else {
      clearSingleAsset();
    }
    
    return () => {
      clearSingleAsset();
    }    
  }, [copyFacN0, fetchAssetByFacN0, clearSingleAsset]);


  useEffect(() => {
    if(singleAsset){
      setAssetData(prev => ({
        ...prev,
        singleAsset,
        FacNO: singleAsset.FacNO, 
        FacName: singleAsset.FacName ? `${singleAsset.FacName}` : '',
        Description: singleAsset.Description || '',
        Unit: singleAsset.Unit || '',
        ItemClass: singleAsset.ItemClass || '',
        CATEGORY: singleAsset.CATEGORY || '',
        ItemLocation: singleAsset.ItemLocation || '',
        Department: singleAsset.Department || '',  
        ReferenceNo: singleAsset.ReferenceNo || '', 
        Brand: singleAsset.Brand || '',
        serialNo: singleAsset.serialNo || '',
        Color: singleAsset.Color || '',
        StartDate: singleAsset.StartDate || '',
        EndDate: singleAsset.EndDate || '',
        Adate: singleAsset.Adate || '',
        balance_unit: singleAsset.balance_unit || '',
        AAmount: singleAsset.AAmount || '',
        Percent: singleAsset.Percent || '',
        Abre: singleAsset.Abre || '',
      }))
    }
  }, [singleAsset]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ...  H a n d l e r s ... //

  const handleEditButton = () => {
    setIsEditing(prev => !prev)
  }

  const handleChange = (field, value) => {
    setAssetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try{
      setSaveError(null);
      const payload = prepareAssetPayload(asset);
      console.log('Saving', asset.FacNO, payload);
      await updateAsset(asset.FacNO, payload);
      showSnackbar('Changes have been saved successfully.');
      setIsEditing(false);


    } catch (error) {
      setSaveError(error.message || 'Failed to save asset');
    }

  }

  const cancelEdit = () => {
    setIsEditing(false);
    setAssetData(prev => ({
      ...prev,
      ...singleAsset
    }));
  };
  

  if (isLoading) return <p className="p-5">Loading asset...</p>;
  if (error) return <p className="p-5 text-red-600">Error loading asset data.</p>;

  return(
    <>
      <div className='grid px-10 py-3 mx-32'>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* ... B u t t o n s ... */}
          
          {/* Edit Button */}          
          <div className='flex justify-end gap-2 mt-8 mb-3'>
            
            {/* SAVE BUTTON */}
            {isEditing && (
              <button
                className='flex justify-center pt-1 pb-1 pl-2 pr-3 text-white transition-transform duration-200 ease-in-out bg-green-500 border rounded-full shadow-black border-spacing-1 active:scale-95 hover:bg-green-700'
                title='Save Changes'
                color="primary"
                sx={{ border: 1 }}
                onClick={handleSave}
              >
                <SaveIcon />
                Save
              </button>
            )}
            
            {/* EDIT and CANCEL BUTTON */}
              <button
                className= {`flex justify-center pt-1 pb-1 pl-2 pr-3 text-white transition-transform duration-200 ease-in-out border rounded-full
                  ${isEditing? 'bg-gray-600  hover:bg-gray-400 hover:text-white' : 'bg-blue-800 text-white hover:bg-blue-600' }  
                  border-slate-300 active:scale-95`}
                title={isEditing? 'Cancel Edit' : 'Edit Asset'}
                type="button" // Use this to prevent from submission
                onClick={isEditing? cancelEdit : handleEditButton}
              >
                {isEditing ? 
                  <><CancelIcon size ="small"/> <span>Cancel </span></>:
                  <><EditIcon size ="small"/> <span>Edit</span></>
                }
              </button>
          </div>


          {/* ... F i e l d s ... */}
      
          <div  className='mb-1'>
            <p className='p-3 pl-16 font-medium tracking-wide bg-white border rounded-md shadow-md text-normal shadow-slate-300 border-slate-300 text-slate-800'
            >Asset Number: {asset.FacNO}</p>
    
            <div className='grid grid-cols-[2fr_1fr] mt-3  shadow-md shadow-slate-300 bg-white border rounded-md border-slate-300 text-slate-800'>
              {/* Column 1: Asset Name and Description */}
              <div className='mt-3'>
                <div className='grid grid-cols-[10rem_2fr] gap-4 shadow-sm shadow-slate-200 mt-1 ml-16 py-2 px-2 text-base bg-gray-100'>
                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Asset Name:</span>
                  <input type="text" className='p-2 mr-5 text-base'  disabled={!isEditing} value={asset.FacName|| ''} readOnly={!isEditing} onChange={(e) => handleChange('FacName', e.target.value)}/>
                  
                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Description:</span>
                  <input type="text" className='p-2 mr-5 text-base'  disabled={!isEditing} value={asset.Description || ''} readOnly={!isEditing} onChange={(e) => handleChange('Description', e.target.value)}/>

                  <span className='p-2 pl-5 text-base tracking-wider text-gray-500'>Status:</span>
                  <input type="text" className='p-2 text-base font-semibold tracking-wider text-green-600' disabled value={asset.xxStats || 'Active'} readOnly />
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