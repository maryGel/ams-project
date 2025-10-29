import * as React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField, // Example form fields
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

// 1. Define your step labels
const steps = ['General Info', 'Account Assignment', 'Upload Picture'];

// 2. Component for the entire multi-step form
export default function CreateAsset() {
  const [activeStep, setActiveStep] = React.useState(0);
  // const [skipped, setSkipped] = React.useState(new Set());

  // 3. State to hold all form data
  const [assetData, setAssetData] = React.useState({
    generalInfo: { assetName: '', assetGroup: '' },
    accountAssignment: { department: '', location: '' },
    uploadPicture: { file: null, preview: '' },
  });

  const handleNext = () => {
    // Optional: Add validation logic for the current step before proceeding
    // For example: if activeStep === 0, validate generalInfo fields
    // if (!validateStep(activeStep)) return; 

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

  // 4. Function to render content for each step
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <TextField
              label="Asset Name"
              fullWidth
              margin="normal"
              value={assetData.generalInfo.assetName}
              onChange={(e) =>
                setAssetData({
                  ...assetData,
                  generalInfo: { ...assetData.generalInfo, assetName: e.target.value },
                })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Asset Group</InputLabel>
              <Select
                value={assetData.generalInfo.assetGroup}
                label="Asset Group"
                onChange={(e) =>
                  setAssetData({
                    ...assetData,
                    generalInfo: { ...assetData.generalInfo, assetGroup: e.target.value },
                  })
                }
              >
                <MenuItem value="Vehicle">Vehicle</MenuItem>
                <MenuItem value="Office Equipment">Office Equipment</MenuItem>
                <MenuItem value="Machinery & Equipment">Machinery & Equipment</MenuItem>
              </Select>
            </FormControl>
            {/* ... other general info fields */}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Assignment
            </Typography>
            <TextField
              label="Department"
              fullWidth
              margin="normal"
              value={assetData.accountAssignment.department}
              onChange={(e) =>
                setAssetData({
                  ...assetData,
                  accountAssignment: { ...assetData.accountAssignment, department: e.target.value },
                })
              }
            />
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              value={assetData.accountAssignment.location}
              onChange={(e) =>
                setAssetData({
                  ...assetData,
                  accountAssignment: { ...assetData.accountAssignment, location: e.target.value },
                })
              }
            />
            {/* ... other account assignment fields */}
          </Box>
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
            {/* ... other upload fields */}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  }

  // 5. Final Submission Logic
  const handleSubmit = () => {
    console.log('Final Asset Data:', assetData);
    // Here you would typically send `assetData` to your API
    alert('Asset saved successfully! (Check console for data)');
    // After successful submission, you might want to reset the form or navigate
    handleReset(); 
  };

  return (
    <Box sx={{ width: '100%', mt: 6, px: 10 }}>
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