import React from 'react';
import {
  Typography,
  TextField, // Example form fields
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';

//Custom Hooks
import { useRefCategory } from '../../hooks/refCategory';
import { useRefItemClass } from '../../hooks/refClass';
import { useRefLocation } from '../../hooks/refLocation'; 
import { useRefDepartment } from '../../hooks/refDepartment'; 

export default function CreateAssetAcctAsgmnt({
  useProps, 
  asset,
  loading,
  error
}) {

  const {refCategoryData} = useRefCategory(useProps);
  const {refItemClassData} = useRefItemClass(useProps);
  const {refDeptData} = useRefDepartment(useProps);
  const {refLocData} = useRefLocation(useProps);


  if (loading) return <div className="p-4 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error ref Cat loading data.. {error.message}</div>;

      return (
        <div className='grid justify-center gap-2 mt-10'>
          <Typography variant="h6" gutterBottom>
            Account Assignment
          </Typography>

          <Autocomplete
            key = {`Asset Group`}
            sx={{ width: '50rem', marginTop: '1rem'}}
            margin="normal" 
            options = {refCategoryData.map(item => item.category)}  
            value = {asset.CATEGORY || []}       
          
            renderInput={(params) => (
              <TextField {...params} 
                label="Asset Group" 
                placeholder="Asset Group" 
                sx ={{'& .MuiInputBase-input': { fontSize: '.9rem'}}}
              />              
            )}          
          />

          <Autocomplete
            key = {`Asset Class`}
            sx={{ width: '50rem', marginTop: '1rem'}}
            margin="normal" 
            options = {refItemClassData.map(item => item.itemClass)}  
            value = {asset.ItemClass || []}       
          
            renderInput={(params) => (
              <TextField {...params} 
                label="Asset Class" 
                placeholder="Asset Class" 
                sx ={{'& .MuiInputBase-input': { fontSize: '.9rem'}}}
              />              
            )}          
          />

          <Autocomplete
            key = {`Department`}
            sx={{ width: '50rem', marginTop: '1rem'}}
            margin="normal" 
            options = {refDeptData.map(item => item.Department)}  
            value = {asset.Department || []}       
          
            renderInput={(params) => (
              <TextField {...params} 
                label="Department" 
                placeholder="Department" 
                sx ={{'& .MuiInputBase-input': { fontSize: '.9rem'}}}
              />              
            )}          
          />

          <Autocomplete
            key = {`Location`}
            sx={{ width: '50rem', marginTop: '1rem'}}
            margin="normal" 
            options = {refLocData.map(item => item.LocationName)}  
            value = {asset.ItemLocation || []}       
          
            renderInput={(params) => (
              <TextField {...params} 
                label="Location" 
                placeholder="Location" 
                sx ={{'& .MuiInputBase-input': { fontSize: '.9rem'}}}
              />              
            )}          
          />

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