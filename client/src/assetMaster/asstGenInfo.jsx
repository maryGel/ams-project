import React from 'react';
import {
  Button,
  Typography,
  Box,
  TextField, // Example form fields
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize
} from '@mui/material';




export default function AsstGenInfo() {



      return (
        <div className='flex justify-center p-4 m-4'>

            
          <div className='grid justify-center gap-2 mt-10 '>
          <Typography variant="h6" gutterBottom>
              General Information
          </Typography>

            <TextField
              label="Asset Name"
              sx={{ width: '50rem' }}
              margin="normal"
              // value={assetData.generalInfo}
              // onChange={(e) =>
              //   setAssetData({
              //     ...assetData,
              //     generalInfo: { ...assetData.generalInfo, assetName: e.target.value },
              //   })
              // }
            />

            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Description"
              style={{ 
                width: '50rem',
                resize: 'both',
                marginTop: '1rem',
                padding: '1rem',
                color: 'black',
                border: '1px solid #ccc'
              }}              
            />
 

            <FormControl 
              sx={{ width: '20rem' }}
              margin="normal"
            >
              <InputLabel>UOM</InputLabel>
                <Select label="UOM">
                  <MenuItem value="Vehicle">Piece</MenuItem>
                  <MenuItem value="Office Equipment">Kg</MenuItem>
                  <MenuItem value="Machinery & Equipment">Bag</MenuItem>
                  <MenuItem value="Machinery & Equipment">Unit</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Serial Number"
              sx={{ width: '50rem' }}
              margin="normal"
            />

            <TextField
              label="Brand"
              sx={{ width: '50rem' }}
              margin="normal"
            />


            <TextField
              label="Supplier"
              sx={{ width: '50rem' }}
              margin="normal"
            />

            <TextField
              label="Reference"
              sx={{ width: '50rem' }}
              margin="normal"
            />
         
          </div>
         
        </div>

      );
}