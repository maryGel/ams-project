import React, {useState, useEffect} from "react";
import {
  Typography,
  Box,
  TextField, 
  TextareaAutosize,
  Checkbox,
  FormControlLabel, 
  Autocomplete
} from '@mui/material';
// Custom hooks
import { useRefUom } from '../../hooks/refUom'; // import the refUnit data

{/* --------------------------------------------------
//                    CREATE ASSET 
---------------------------------------------------- */}

export default function CreateAssetGenInfo({
  useProps, 
  asset,
  loading,
  error
  }) {

  const { uomData } = useRefUom(useProps);
  const [ checked, setChecked ] = useState(false);


  if (loading) return <p className="p-5">Loading asset...</p>;
  if (error) return <p className="p-5 text-red-600">Error loading asset data.</p>;
  
  return (
    <Box className='flex justify-center p-4 m-4'  >
      <Box className='grid mt-10 '>
      <Typography variant="h6" gutterBottom>
          General Information
      </Typography>

      {/* NAME and DESCRIPTION  */}

        <TextField
          label={'Asset Name'}
          sx={{ width: '60rem' }}
          margin="normal"
          value={asset.FacName || ''}
          onChange={(e) =>
            setAsset({
              ...assetData,
              generalInfo: { ...assetData.generalInfo, assetName: e.target.value },
            })
          }
        />
        <TextareaAutosize
          aria-label="minimum height"
          minRows={2}
          label={'Asset Description'}
          value={asset.Description || ''}
          style={{ 
            width: '60rem',
            resize: 'both',
            color: 'black',
            padding: '1rem',
            border: '1px solid #ccc',
            marginTop: '1rem'
          }}    
          onChange={(e) =>
            setAsset({
              ...assetData,
              generalInfo: { ...assetData.generalInfo, assetName: e.target.value },
            })
          }
        />

      {/* Date, UOM, QUANTITY, SPLIT */}

        <Box className = "flex gap-2 mt-2">
          <TextField
            label="Acquisition Date"
            sx={{ 
              width: '16rem',
              color: 'gray',
              "& .MuiInputBase-input": {
              color: "gray",
              }
            }}
            type="date"
            margin="normal" 
            // value={date}
            // onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            
          />

          <Autocomplete
            key = {`Unit of Measure`}
            sx={{ width: '10rem', marginTop: '1rem'}}
            margin="normal" 
            options = {uomData.map(item => item.Unit)}  
            value = {asset.Unit || []}       
          
            renderInput={(params) => (
              <TextField {...params} 
                label="UOM" 
                placeholder="UOM" 
                sx ={{'& .MuiInputBase-input': { fontSize: '14px'}}}
              />              
            )}          
          />

          <TextField
            label="Quantity"
            sx={{ width: '15rem' }}
            margin="normal" 
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                sx={{ color: 'gray' }}
              />
            }
            label="Split Asset"
            sx={{ color: 'gray' }}
          />
        </Box>

        <Box className = "flex gap-2">
          <TextField
          label={'Serial Number'}
          value={asset.serialNo || ''}
          sx={{ width: '30rem' }}
          margin="normal"
          />

          <TextField
          label={'Brand'}
          value={asset.Brand || ''}
          sx={{ width: '20rem' }}
          margin="normal" 
          />
        </Box>

        <TextField
          label={'Supplier'}
          value={asset.suppName || ''}
          sx={{ width: '60rem' }}
          margin="normal" 
        />

        <TextField
          label="Reference"
          sx={{ width: '60rem' }}
          margin="normal" 
          value= {asset.ReferenceNo || ''}
        />
      </Box>
    </Box>
  );
}