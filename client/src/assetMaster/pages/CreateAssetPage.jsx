import React, {useState, useEffect} from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box
} from '@mui/material';
//import Asset Fields
import CreateAssetGenInfo from '../createAsset/createAssetGenInfo';
import CreateAssetAcctAsgmnt from '../createAsset/createAssetAcctAsgmnt';
import { useSearchParams } from 'react-router-dom';

// Custom hooks
import { useAssetMasterData } from '../../hooks/assetMasterHooks'; // import the itemlist

  // Define your step labels
const steps = ['General Info', 'Account Assignment', 'Upload Picture'];



  //  ************ COMPONENT CREATE ASSET ****************

  // Component for the entire multi-step form
export default function CreateAsset() {
  const { itemList, loading, error } = useAssetMasterData();   
  const [ asset, setAsset ] = useState({});
  const [ activeStep, setActiveStep ] = useState(0);
  const [ searchParams  ] = useSearchParams();
  const facNo = searchParams.get('copyFrom');
  
  
  console.log(`create assetpage: ${facNo}`)

  // State to hold all form data
  const [assetData, setAssetData] = useState({
    generalInfo: { },
    accountAssignment: { },
    uploadPicture: { file: null, preview: '' }
  });

  // Fetch Asset data from API on component mount
  useEffect(() => {

    if (!itemList || itemList.length === 0) return;
    //Clean the route facNo
    const targetFacNoClean = facNo?.replace(/\s/g, '').toUpperCase();

    const matchingAsset = itemList.find(item => {
      if (!item.FacNO || typeof item.FacNO !== 'string') return false;
      const itemFacNoClean = item.FacNO
        .replace(/\u00A0/g, '') // Remove NBSP
        .replace(/\s/g, '') // Remove normal whitespace
        .toUpperCase();
      console.log(`itemFacNoClean: ${itemFacNoClean}`)
      return itemFacNoClean === targetFacNoClean;
      
      });
      setAsset(matchingAsset || {});
  }, [itemList, facNo]);

  // Handle functions 

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setAssetData({
      generalInfo: { assetName: '', assetGroup: '' },
      accountAssignment: { department: '', location: '' },
      uploadPicture: { file: null, preview: '' },
    });
  };

  // Function to render content for each step
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <CreateAssetGenInfo
            assetData = {assetData}
            setAssetData = {setAssetData}
            asset = {asset}
            loading = {loading}
            error = {error}
          />
        );
      case 1:
        return (
          <CreateAssetAcctAsgmnt
            assetData = {assetData}
            setAssetData = {setAssetData}  
            asset = {asset}
            loading = {loading}
            error = {error}          
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
                    setAssetData({
                      ...assetData,
                      uploadPicture: { file, preview: URL.createObjectURL(file) },
                    });
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

  // Final Submission Logic
  const handleSubmit = () => {
    console.log('Final Asset Data:', assetData);
    // Here you would typically send `assetData` to your API
    alert('Asset saved successfully! (Check console for data)');
    // After successful submission, you might want to reset the form or navigate
    handleReset(); 
  };

  return (
    <Box sx={{ width: '100%', mt: 6, px: 30 }}>
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
            <Button variant="contained" onClick={handleSubmit} sx={{ ml: 1 }}>
              Save Asset
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