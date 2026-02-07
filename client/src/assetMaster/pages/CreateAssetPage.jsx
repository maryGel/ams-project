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

// Custom hooks
import CreateAssetGenInfo from '../createAsset/createAssetGenInfo';
import CreateAssetCapitalization from '../createAsset/createAssetCapitalization';
import ValidationAlert from '../createAsset/assetValidationAlert';
import AssetFileUpload from '../createAsset/assetFileUpload';
import SummarySection from '../createAsset/summarySection';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRefCategory } from '../../hooks/refCategory';
import { useAssetMasterData } from '../../hooks/assetMasterHooks'; // import the itemlist

// fields and utilities
import { assetMasterFields, requiredFields, prepareAssetPayload, validationFinalSubmission, validateStep, getStepValidationErrors } from '../createAsset/assetMasterFields';


// Define your step labels
const steps = ['General Info', 'Capitalization Parameters', 'Upload Picture'];

export default function CreateAsset(setHeaderTitle) {
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
  const [ searchParams  ] = useSearchParams();
  const navigate = useNavigate();

  // State variables
  const [ assetData, setAssetData ] = useState(assetMasterFields);
  const [ asset, setAsset ] = useState({}); // Copy to New asset
  const [ activeStep, setActiveStep ] = useState(0);
  const [ submitError, setSubmitError ] = useState(null);
  const [ submitSuccess, setSubmitSucess] = useState(false);
  const [ generatedFacNO, setGeneratedFacNO ] = useState('');

  const copyFacN0 = searchParams.get('copyFrom');  

  // Effects
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

  // Populate from data when singleAsset is fetched
  useEffect(() => {
    if (singleAsset) {
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
    }
  }, [singleAsset]);

  // Generate FacNO when category is selected
  useEffect(() => {
    if (assetData.CATEGORY && refCategoryData && refCategoryData.length > 0) {
      // Find the selected category in refCategoryData
      const selectedCategory = refCategoryData.find(
        cat => cat.category === assetData.CATEGORY
      );

      if (selectedCategory && selectedCategory.xCode) {
        generateNextFacNO(selectedCategory.xCode).then(newFacNO => {         
          if (newFacNO && typeof newFacNO === 'string') {
            setGeneratedFacNO(newFacNO);
            setAssetData(prev => ({...prev, FacNO: newFacNO }));
          } 
        }).catch(console.error);
      } 
    } 
  }, [assetData.CATEGORY, refCategoryData, assets]);

  // Function to generate next asset number
  const generateNextFacNO = useCallback(async (xCode) => {
    if (!xCode) return '';     

    try {
      // Find the highest existing number for this xCode
      const response = await api.get('/itemlist/assetMasterlist');
      const allAssets = response.data || [];

      const existingAssets = allAssets.filter(asset => 
        asset.FacNO && asset.FacNO.startsWith(`${xCode}-`)
      );
      
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
      return generated;
    } catch (error) {
      console.error('Error generating FacN0:', error);
      return '';
    }    
  }, []);

  // Handlers
  const updateAssetData = (fieldsUpdates) => {
    setAssetData(prev => ({
      ...prev,
      ...fieldsUpdates
    }));
  };

  const handleNext = () => {
    // Clear previous errors
    setSubmitError(null);
    
    const validationErrors = getStepValidationErrors(activeStep, assetData, requiredFields);

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors);
      return;
    }

    // If validation passes, move to next step
    // If we're on the last step (steps.length - 1), go to summary
    if (activeStep === steps.length - 1) {
      setActiveStep(steps.length);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    // If we're on the summary page (steps.length), go back to last step
    if (activeStep === steps.length) {
      setActiveStep(steps.length - 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    // Clean up object URL if exists
    if (assetData.uploadPicture.preview) {
      URL.revokeObjectURL(assetData.uploadPicture.preview);
    }

    setActiveStep(0);
    setAssetData(assetMasterFields);
    setGeneratedFacNO('');
    setSubmitError(null);
    setSubmitSucess(false);
  };

  // Final Submission using createAsset hook
  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setSubmitError(null);

      // Check if FacNO is empty or an object
      if (!assetData.FacNO || typeof assetData.FacNO === 'object') {
        setSubmitError('Asset Number could not be generated. Please check category selection.');
        return;
      }

      // Final Validation
      const validationErrors = validationFinalSubmission(assetData, requiredFields);
      if (validationErrors.length > 0) {
        setSubmitError(validationErrors);
        return;
      }
    
      // TEMPORARY: Force a FacNO for testing
      const finalFacNO = assetData.FacNO && typeof assetData.FacNO === 'string' 
        ? assetData.FacNO 
        : 'TEST-000001';
      
      // Prepare payload for API
      const payload = prepareAssetPayload({
        ...assetData,
        FacNO: finalFacNO
      });
    
      // Call createAsset from hook
      await createAsset(payload);
      setSubmitSucess(true);

      setTimeout(() => {
        navigate(`/assetFolder/assetMasterDisplay?copyFrom=${assetData.FacNO}`);
        setHeaderTitle(`Asset Master Display`);
      }, 2000);

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
  const getStepContent = (step) => {
    const stepProps = {
      assetData,
      updateAssetData,
      originalAsset: singleAsset,
      loading: isLoadingSingle,
      error: assetError,
      generatedFacNO
    };

    switch (step) {
      case 0:
        return <CreateAssetGenInfo {...stepProps} />;
      case 1:
        return <CreateAssetCapitalization {...stepProps} refCategoryData={refCategoryData} />;
      case 2:
        return <AssetFileUpload assetData={assetData} updateAssetData={updateAssetData} />;
      default:
        return 'Unknown step';
    }
  };

  // Create summary sections
  const summarySections = [
    {
      title: 'General Information',
      fields: [
        { label: 'Asset Number', value: assetData.FacNO || 'Not generated yet' },
        { label: 'Asset Name', value: assetData.FacName },
        { label: 'Description', value: assetData.Description },
        { label: 'Serial Number', value: assetData.serialNo || 'N/A' },
        { label: 'Brand', value: assetData.Brand || 'N/A' },
        { label: 'Reference No.', value: assetData.ReferenceNo },
        { label: 'Supplier', value: assetData.suppName || 'N/A' },
        { label: 'Color', value: assetData.Color || 'N/A' },
      ],
      stepIndex: 0
    },
    {
      title: 'Capitalization Details',
      fields: [
        { label: 'Category', value: assetData.CATEGORY },
        { label: 'Item Class', value: assetData.ItemClass },
        { label: 'Unit', value: assetData.Unit },
        { label: 'Quantity', value: assetData.balance_unit },
        { label: 'Acquisition Date', value: assetData.Adate },
        { label: 'Acquired Value', value: assetData.AAmount },
        { label: 'Residual Value', value: assetData.Abre },
        { label: 'Life in Years', value: assetData.Percent},
        { label: 'Location', value: assetData.ItemLocation },
        { label: 'Department', value: assetData.Department },
      ],
      stepIndex: 1
    },
    {
      title: 'Additional Information',
      fields: [
        { label: 'Picture Uploaded', value: assetData.uploadPicture.file ? 'Yes' : 'No' },
      ],
      stepIndex: 2
    }
  ];

  // Render final step summary
  const renderFinalStepSummary = () => {
    const validationErrors = validationFinalSubmission(assetData, requiredFields);

    return (
      <React.Fragment>
        <Box className="pl-4 mt-4 text-base">
          <Typography variant="h6" gutterBottom>
            Review and Submit
          </Typography>
        </Box>
        
        {summarySections.map((section, index) => (
          <SummarySection
            key={index}
            {...section}
            onEdit={setActiveStep}
          />
        ))}
        
        <ValidationAlert errors={validationErrors} type="warning" />
        
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back to Previous Step
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button 
            onClick={handleReset}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Reset All
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={isMutating || validationErrors.length > 0}
          >
            {isMutating ? <CircularProgress size={24} /> : 'Submit Asset'}
          </Button>
        </Box>
      </React.Fragment>
    );
  };

  // Main render
  return (
    <Box sx={{ width: '100%', mt: 6, px: 30 }}>
      {/* Debug info - remove in production */}
      <div style={{ display: 'none' }}>
        Active Step: {activeStep}, Steps Length: {steps.length}, Show Summary: {activeStep === steps.length ? 'Yes' : 'No'}
      </div>
      
      {/* Success Alert */}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Asset created successfully! Redirecting...
        </Alert>
      )}
      
      {/* Validation Errors Alert */}
      <ValidationAlert errors={submitError} />
      
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === steps.length ? (
        renderFinalStepSummary()
      ) : (
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
            <Button 
              onClick={handleNext}
              variant="contained"
            >
              {activeStep === steps.length - 1 ? 'Review' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}