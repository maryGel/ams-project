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
} from '@mui/material';


export default function CreateAssetAcctAsgmnt() {
 
      return (
        <div className='grid justify-center gap-2 mt-10'>
           <Typography variant="h6" gutterBottom>
            Account Assignment
          </Typography>

           <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Asset Group</InputLabel>
                <Select label="Asset Group">
                  <MenuItem value="Vehicle">Vehicle</MenuItem>
                  <MenuItem value="Office Equipment">Office Equipment</MenuItem>
                  <MenuItem value="Machinery & Equipment">Machinery & Equipment</MenuItem>
              </Select>
            </FormControl>

            <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Asset Class</InputLabel>
                <Select label="Asset Group">
                  <MenuItem value="Vehicle">Roofing</MenuItem>
                  <MenuItem value="Office Equipment">Wailing</MenuItem>
                  <MenuItem value="Machinery & Equipment">Renovation</MenuItem>
              </Select>
            </FormControl>

            <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Department</InputLabel>
                <Select label="Department">
                  <MenuItem value="Vehicle">Engineering</MenuItem>
                  <MenuItem value="Office Equipment">Accounting</MenuItem>
                  <MenuItem value="Machinery & Equipment">Sales</MenuItem>
                  <MenuItem value="Machinery & Equipment">HR</MenuItem>
              </Select>
            </FormControl>

            <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Location</InputLabel>
                <Select label="Location">
                  <MenuItem value="Vehicle">Storeroom</MenuItem>
                  <MenuItem value="Office Equipment">Staffhouse</MenuItem>
                  <MenuItem value="Machinery & Equipment">AquaSports</MenuItem>
                  <MenuItem value="Machinery & Equipment">Villa 1</MenuItem>
              </Select>
            </FormControl>

            <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Capitalization</InputLabel>
                <Select label="Asset Group">
                  <MenuItem value="Vehicle">1. External Acquisition - by Purchase</MenuItem>
                  <MenuItem value="Office Equipment">2. Internal Costing</MenuItem>
              </Select>
            </FormControl>



            <FormControl 
              sx={{ width: '50rem' }}
              margin="normal"
            >
              <InputLabel>Depreciation</InputLabel>
                <Select label="Asset Group">
                  <MenuItem value="Vehicle">Ordinary Depreciation</MenuItem>
                  <MenuItem value="Office Equipment">Sum of the Years</MenuItem>
                  <MenuItem value="Machinery & Equipment">Double Declining</MenuItem>
              </Select>
            </FormControl>
        </div>
      );
   
  
}