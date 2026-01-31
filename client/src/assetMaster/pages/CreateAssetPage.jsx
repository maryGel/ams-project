import React, {useState, useEffect, useCallback} from 'react';
import { api } from '../../api/axios'; 
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
//import Asset Fields
import CreateAssetGenInfo from '../createAsset/createAssetGenInfo';
import CreateAssetCapitalization from '../createAsset/createAssetCapitalization';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRefCategory } from '../../hooks/refCategory';

// Custom hooks
import { useAssetMasterData } from '../../hooks/assetMasterHooks'; // import the itemlist
// import { create } from '@mui/material/styles/createTransitions';

// Define your step labels
const steps = ['General Info', 'Capitalization Parameters', 'Upload Picture'];


{/*--------------------------------------------------------
  -     C R E A T E   A S S E T   C O M P O N E N T.      -
  --------------------------------------------------------*/}

export default function CreateAsset() {
  const { 
    assets, 
    singleAsset,
    fetchAssetByFacN0,
    clearSingleAsset,
    createAsset, 
    isLoading, 
    isMutating,
    isLoadingSingle, 
    error: assetError
  } = useAssetMasterData();   
  const { refCategoryData } = useRefCategory();
  const [ asset, setAsset ] = useState({}); // Copy to New asset
  const [ activeStep, setActiveStep ] = useState(0);
  const [ searchParams  ] = useSearchParams();
  const [ submitError, setSubmitError ] = useState(null);
  const [ submitSuccess, setSubmitSucess] = useState(false);
  const [ generatedFacNO, setGeneratedFacNO ] = useState('');
  const navigate = useNavigate();

  // State to hold all form data
  const [assetData, setAssetData] = useState({
    // General Info fields
    FacNO: '',
    FacName: '',
    Description: '',
    serialNo: '',
    Brand: '',
    suppName: '',
    ReferenceNo: '',
    Color: '',
    StartDate: '', 
    EndDate: '', 
    
    // Capitalization fields
    Adate: '', 
    Unit: '',
    balance_unit: 1,
    ItemClass: '',
    CATEGORY: '',
    ItemLocation: '',
    Department: '',
    
    // Other fields
    // splitAsset: 0, 
    uploadPicture: { file: null, preview: '' },
    
    // Additional fields for backend
    Holder: '',
    AAmount: 0,
    Percent: 0,
    Abre: 0,
    Remarks: ''
  });


  const copyFacN0 = searchParams.get('copyFrom');  
  console.log(`copyFacN0: ${copyFacN0}`);

  // ... State to hold all form data ... //
  // ... Fetch single asset when copyFacN0 changes
  useEffect(() => {
    console.log('CreateAsset useEffect - copyFacN0:', copyFacN0);
    if (copyFacN0){
      console.log('Fetching asset for:', copyFacN0);
      fetchAssetByFacN0(copyFacN0);
    } else {
      console.log('Clearing single asset');
      clearSingleAsset();
    }

    // Cleanup when component unmounts or copyFacN0 changes
    return () => {
      console.log('Cleanup running');
      clearSingleAsset();
    }
  }, [copyFacN0, fetchAssetByFacN0, clearSingleAsset]); 

  // Populate form data when sindleAsset is fetched
  useEffect(() => {
  if (singleAsset) 
    setAssetData(prev => ({
      ...prev,
      ...singleAsset,
      FacNO: '', // Will generate based on new category
      FacName: singleAsset.FacName ? `${singleAsset.FacName} (Copy)` : '',
      Description: singleAsset.Description || '',
      Unit: singleAsset.Unit || '',
      ItemClass: singleAsset.ItemClass || '',
      CATEGORY: singleAsset.CATEGORY || '',
      ItemLocation: singleAsset.ItemLocation || '',
      Department: singleAsset.Department || '',  
      ReferenceNo: singleAsset.ReferenceNo || '',      
  }));
    setAsset(singleAsset);
    // console.log(`Copied asset: ${FacNO}`);
  }, [singleAsset]);

 // Generate FacNO when category is selected
  useEffect(() => {
      console.log('=== FacNO Generation Debug START ===');
      console.log('1. assetData.CATEGORY:', assetData.CATEGORY);
      console.log('2. refCategoryData exists?:', !!refCategoryData);
      console.log('3. refCategoryData length:', refCategoryData?.length);
      console.log('4. Current assetData.FacNO:', assetData.FacNO);

    if (assetData.CATEGORY && refCategoryData && refCategoryData.length > 0) {
      // Find the selected category in refCategoryData
      const selectedCategory = refCategoryData.find(
        cat => cat.category === assetData.CATEGORY
      );

      console.log('5. selectedCategory found?:', !!selectedCategory);
      console.log('6. selectedCategory:', selectedCategory);
      console.log('7. selectedCategory.xCode:', selectedCategory?.xCode);
    
      
      if (selectedCategory && selectedCategory.xCode) {
        console.log('8. Calling generateNextFacNO with xCode:', selectedCategory.xCode);

        generateNextFacNO(selectedCategory.xCode).then(newFacNO => {
          console.log('9. generateNextFacNO returned:', newFacNO);
          console.log('10. Type of newFacNO:', typeof newFacNO);
          
          if (newFacNO && typeof newFacNO === 'string') {
          setGeneratedFacNO(newFacNO);

          // Update assetData with generated FacNO
          setAssetData(prev => ({
            ...prev,
            FacNO: newFacNO
          }));
          console.log('11. Updated assetData.FacNO to:', newFacNO);
          } else {
            console.error('12. ERROR: generateNextFacNO returned invalid value:', newFacNO);
          }
        }).catch(error => {
          console.error('13. ERROR in generateNextFacNO promise:', error);
        })
      } else {
        console.warn('15. Missing data for FacNO generation:', {
          hasCategory: !!assetData.CATEGORY,
          hasRefData: !!refCategoryData,
          refDataLength: refCategoryData?.length
        });
      }
    } console.log('=== FacNO Generation Debug END ===');
  }, [assetData.CATEGORY, refCategoryData, assets]);

  // Function to generate next asset number
  const generateNextFacNO = useCallback(async (xCode) => {
    if (!xCode) {
      console.error('No xCode provided to generateNextFacNO');
      return '';
    }
      

    try {
      console.log('Generating FacNO for xCode:', xCode);
      // Find the highest existing number for this xCode
      const response = await api.get('/itemlist/assetMasterlist');
      const allAssets = response.data || [];

      console.log('Total assets fetched:', allAssets.length);

      const existingAssets = allAssets.filter(asset => 
        asset.FacNO && asset.FacNO.startsWith(`${xCode}-`)
      );

      console.log(`Existing assets with ${xCode}- prefix:`, existingAssets.length);
      
      let maxNumber = 0;
      existingAssets.forEach(asset => {
        const match = asset.FacNO.match(/-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) maxNumber = num;
        }
      });
    
      // Increment and format with leading zeros
      const nextNumber = maxNumber + 1;
      const generated =  `${xCode}-${nextNumber.toString().padStart(7, '0')}`;
      return generated

    } catch ( error ){
      console.error('Error generating FacN0:', error)
      return '';
    }    
  }, []);


  // Add validation function
  const validateStep = (step) => {
    switch (step) {
      case 0: // General Info step
        return assetData.FacName.trim();
      case 1: // Account Assignment step  
        return assetData.CATEGORY.trim() && assetData.ItemClass.trim();
      default:
        return true;
    }
  };


  //  .... H A N D L E R S ....  //

  const updateAssetData = (fieldsUpdates) => {
    setAssetData(prev => ({
      ...prev,
      ...fieldsUpdates
    }));
  };

  const handleNext = () => {
    if (!validateStep(activeStep)){
      setSubmitError(`Please fill in all required fields in step ${activeStep + 1}`);
      return;
    };
    setSubmitError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAssetData({
      FacNO: '',
      FacName: '',
      Description: '',
      Adate: '',
      Unit: '',
      balance_unit: 1,
      serialNo: '',
      Brand: '',
      suppName: '',
      ReferenceNo: '',
      Color: '',
      StartDate: '',
      EndDate: '',
      ItemClass: '',
      CATEGORY: '',
      ItemLocation: '',
      Department: '',
      status: 'Active',
      // splitAsset: 0,
      uploadPicture: { file: null, preview: '' }
    });
    setGeneratedFacNO('');
    setSubmitError(null);
    setSubmitSucess(false);
  };


  // Final Submission using createAsset hook
  const handleSubmit = async () => {
    try {
      console.log('=== DEBUG FacNO Generation ===');
      console.log('generatedFacNO:', generatedFacNO);
      console.log('assetData.FacNO:', assetData.FacNO);
      console.log('typeof assetData.FacNO:', typeof assetData.FacNO);
      console.log('assetData.CATEGORY:', assetData.CATEGORY);
      console.log('refCategoryData:', refCategoryData);
            
      
      // Check if FacNO is empty or an object
      if (!assetData.FacNO || typeof assetData.FacNO === 'object') {
        console.error('ERROR: FacNO is invalid:', assetData.FacNO);
        setSubmitError('Asset Number could not be generated. Please check category selection.');
        return;
      }

      setSubmitError(null);

      // Final validation
      if (!assetData.FacNO) {
        setSubmitError('Asset Number could not be generated. Please check category selection.');
        return;
      }
            
      if (!assetData.FacName.trim()) {
        setSubmitError('Asset Name is required');
        return;
      }

      if (!assetData.Description.trim()) {
        setSubmitError('Description is required');
        return;
      }
      
      if (!assetData.CATEGORY.trim()) {
        setSubmitError('Asset Category is required');
        return;
      }
      
      if (!assetData.ItemClass.trim()) {
        setSubmitError('Asset Class is required');
        return;
      }

      if (!assetData.Unit.trim()) {
        setSubmitError('Unit of measure is required');
        return;
      }


      if (!assetData.Adate.trim()) {
        setSubmitError('Acquistion Date is required');
        return;
      }

      if (!assetData.AAmount.trim()) {
        setSubmitError('Acquisition amount is required');
        return;
      }
            
      if (!assetData.ItemLocation.trim()) {
        setSubmitError('Location is required');
        return;
      }

      if (!assetData.Department.trim()) {
        setSubmitError('Department is required');
        return;
      }
      
      if (!assetData.ReferenceNo.trim()) {
        setSubmitError('Reference No. is required');
        return;
      }

    // Generate a test FacNO if not available
    // const finalFacNO = assetData.FacNO || 'TEST-000001';

     // TEMPORARY: Force a FacNO for testing
    const finalFacNO = assetData.FacNO && typeof assetData.FacNO === 'string' 
      ? assetData.FacNO 
      : 'TEST-000001';
    
    console.log('Using FacNO:', finalFacNO);

      // Prepare payload for API
      const payload = {
        // Required fields
        FacNO: assetData.FacNO,
        FacName: assetData.FacName,
        Description: assetData.Description || '',
        ItemClass: assetData.ItemClass,
        CATEGORY: assetData.CATEGORY,
        
        // Optional fields with correct backend field names
        Unit: assetData.Unit || '',
        serialNo: assetData.serialNo || '',
        Department: assetData.Department || '',
        Adate: assetData.Adate || null, 
        ItemLocation: assetData.ItemLocation || '',
        balance_unit: assetData.balance_unit || 1,
        suppName: assetData.suppName || '',
        Brand: assetData.Brand || '',
        Color: assetData.Color || '',
        ReferenceNo: assetData.ReferenceNo || '',
        StartDate: assetData.StartDate || null, 
        EndDate: assetData.EndDate || null, 
        
        // Split asset as number (0 or 1)
        // splitAsset: assetData.splitAsset ? 1 : 0, 
        
        // Additional fields your backend might expect
        AAmount: assetData.AAmount ? assetData.AAmount.toString().replace(/,/g, '') : 0.00, 
        Percent: assetData.Percent || 1, // Might be required
        Abre: assetData.Abre ? assetData.Abre.toString().replace(/,/g, '') : 0.00, // Might be required
        Remarks: '', // Optional
        
        // Status is hardcoded in backend as 'ACTIVE'
        // xStatus will be set by backend
      }
      console.log('Submitting payload to backend:', JSON.stringify(payload, null, 2));

      // Call createAsset from hook
      await createAsset(payload);
      setSubmitSucess(true);

      setTimeout(() => {
        navigate('/assetFolder/pages/assetMasterList');
      },2000);

        {

    }
          // In createAsset hook, before making the request:
      console.log('=== BACKEND EXPECTS THESE FIELD NAMES ===');
      console.log('FacNO, FacName, Description, ItemClass, CATEGORY');
      console.log('Unit, serialNo, Department, Holder, Adate');
      console.log('AAmount, Percent, Abre, ItemLocation, balance_unit');
      console.log('suppName, Brand, Color, StartDate, EndDate');
      console.log('ReferenceNo, Remarks');
      console.log('=== ACTUAL PAYLOAD ===');
      console.log('Payload keys:', Object.keys(payload));
      

    } catch (error) {
      console.error('Error creating asset:', error);

      // Get detailed error message
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Failed to create asset';
      
      setSubmitError(`Error: ${errorMessage}`);
    }
  };

  // Function to render content for each step
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <CreateAssetGenInfo
            assetData = {assetData}
            updateAssetData={updateAssetData} 
            originalAsset = {asset}
            loading={isLoadingSingle}
            error = {assetError}
            generatedFacNO={generatedFacNO}
          />
        );
      case 1:
        return (
          <CreateAssetCapitalization
            assetData = {assetData}
            updateAssetData={updateAssetData} 
            originalAsset = {asset}
            loading={isLoadingSingle}
            error = {assetError}        
            refCategoryData={refCategoryData} 
          />
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Picture
            </Typography>
            <Button variant="contained" component="label">
              Upload File
              <input 
                type="file" 
                hidden 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAssetData(prev => ({
                      ...prev,
                      uploadPicture: {
                        file,
                        preview: URL.createObjectURL(file)
                      }
                    }));
                  }
                }}
              />
            </Button>
            {assetData.uploadPicture.preview && (
              <Box mt={2}>
                <Typography variant="subtitle2">Preview:</Typography>
                <img 
                  src={assetData.uploadPicture.preview} 
                  alt="Asset Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} 
                />
              </Box>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  }



  return (
    <Box sx={{ width: '100%', mt: 6, px: 30 }}>
      
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Asset created successfully! Redirecting...
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? ( // Last step reached
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - your asset is ready to be created!
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              sx={{ ml: 1 }}
              disabled= {isMutating}
            >
              {isMutating ? <CircularProgress size={24} /> : 'Save Asset'}
            </Button>
          </Box>
        </React.Fragment>
      ) : ( // Render current step content
        <React.Fragment>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, px: 3 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}