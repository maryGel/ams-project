import React, {useState} from "react";
import {
  Button,
  Typography,
  Box,
  TextField, // Example form fields
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Checkbox,
  FormControlLabel 
} from '@mui/material';



export default function CreateAssetGenInfo() {
    const [checked, setChecked] = useState(false);

      return (
        <Box className='flex justify-center p-4 m-4'  >
                      
          <Box className='grid mt-10 '>
          <Typography variant="h6" gutterBottom>
              General Information
          </Typography>

          {/* NAME and Description */}
          {/* -------------------- */}
            <TextField
              label="Asset Name"
              sx={{ width: '60rem' }}
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
              minRows={2}
              placeholder="Description"
              style={{ 
                width: '60rem',
                resize: 'both',
                color: 'black',
                padding: '1rem',
                border: '1px solid #ccc',
                marginTop: '1rem'
              }}    
            />

          {/* Date, UOM, QUANTITY, SPLIT */}
          {/* -------------------- */}
 
            <Box className = "flex gap-2 mt-2">
              <TextField
                label="Acquisition Date"
                sx={{ 
                  width: '20rem',
                  color: 'gray',
                  "& .MuiInputBase-input": {
                  color: "gray",
                  },

                }}
                type="date"
                margin="normal" 
                // value={date}
                // onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                
              />

              <FormControl 
                sx={{ width: '10rem' }}
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
              label="Serial Number"
              sx={{ width: '30rem' }}
              margin="normal" 
              />

              <TextField
                label="Brand"
                sx={{ width: '20rem' }}
                margin="normal" 
              />
            </Box>

            <TextField
              label="Supplier"
              sx={{ width: '60rem' }}
              margin="normal" 
            />

            <TextField
              label="Reference"
              sx={{ width: '60rem' }}
              margin="normal" 
            />
          </Box>
        </Box>
      );
}