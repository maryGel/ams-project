import { api } from '../../api/axios';

export const assetMasterFields = {
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
}


// Step labels for the stepper
export const stepLabels = ['General Info', 'Capitalization Parameters', 'Upload Picture'];


// Required fields for final submission
export const requiredFields = {
  FacNO: 'Asset Number',
  FacName: 'Asset Name',
  Description: 'Description',
  CATEGORY: 'Asset Category',
  ItemClass: 'Asset Class',
  Unit: 'Unit of measure',
  Adate: 'Acquisition Date',
  AAmount: 'Acquisition amount',
  ItemLocation: 'Location',
  Department: 'Department',
  ReferenceNo: 'Reference No.'
};

// Required field validations for each step
 export const stepRequiredFields = {
    0: ['FacName', 'Description', 'ReferenceNo'], // General Info
    1: ['CATEGORY', 'ItemClass', 'Unit', 'Adate', 'ItemLocation', 'Department'], // Capitalization
    2: [] // Upload Picture (optional)
  }

// Validation a specific steps
export const validateStep = (step, assetData) => {  
  
  const validator = stepRequiredFields[step] || [];
  
  return validator.every(field => assetData[field] && String(assetData[field].trim() !== ''));

};

// Get specific error messages for a step
export const getStepValidationErrors = (step, assetData, requiredFields) => {
  const validator = stepRequiredFields[step] || [];
  const errors = [];

  validator.forEach(field => {
    if (!assetData[field] || String(assetData[field]).trim() === '') {
      errors.push(`${requiredFields[field]} is required.`);
    }
  }); 

  return errors;
};

// Final validation for all required fields
export const validationFinalSubmission = (assetData, requiredFields) => {
  const error = [];

  Object.entries(requiredFields).forEach(([field, label]) => {
    if(!assetData[field] || String(assetData[field]).trim() === ''){
      error.push(`${label} is required`);
    }
  });

  return error;
}


// Function to generate next asset number
export const generateNextFacNO = async (xCode, existingAssets = []) => {
  if (!xCode) {
    console.error('No xCode provided to generateNextFacNO');
    return '';
  }

  try {
    console.log('Generating FacNO for xCode:', xCode);
    
    // Find the highest existing number for this xCode
    const existingAssetsWithPrefix = existingAssets.filter(asset => 
      asset.FacNO && asset.FacNO.startsWith(`${xCode}-`)
    );

    console.log(`Existing assets with ${xCode}- prefix:`, existingAssetsWithPrefix.length);
    
    let maxNumber = 0;
    existingAssetsWithPrefix.forEach(asset => {
      const match = asset.FacNO.match(/-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
  
    // Increment and format with leading zeros
    const nextNumber = maxNumber + 1;
    return `${xCode}-${nextNumber.toString().padStart(7, '0')}`;

  } catch (error) {
    console.error('Error generating FacNO:', error);
    return '';
  }
};


// Prepare payload for API submission
export const prepareAssetPayload = (assetData) => {
  return {
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
    
    // Additional fields
    AAmount: assetData.AAmount ? assetData.AAmount.toString().replace(/,/g, '') : '0.00',
    Percent: assetData.Percent || 1,
    Abre: assetData.Abre ? assetData.Abre.toString().replace(/,/g, '') : '0.00',
    Remarks: assetData.Remarks || '',
    Holder: assetData.Holder || ''
  };
};

// Debug logging utilities
export const logFacNODebug = (assetData, refCategoryData, generatedFacNO) => {
  console.log('=== FacNO Generation Debug ===');
  console.log('1. assetData.CATEGORY:', assetData.CATEGORY);
  console.log('2. refCategoryData exists?:', !!refCategoryData);
  console.log('3. refCategoryData length:', refCategoryData?.length);
  console.log('4. Current assetData.FacNO:', assetData.FacNO);
  console.log('5. generatedFacNO:', generatedFacNO);
  console.log('6. selectedCategory:', selectedCategory);
  console.log('7. selectedCategory.xCode:', selectedCategory?.xCode);
};

export const handleFileUpload = (file, updateAssetData) => {
  if (file) {
    updateAssetData({
      uploadPicture: {
        file,
        preview: URL.createObjectURL(file)
      }
    });
  }
};