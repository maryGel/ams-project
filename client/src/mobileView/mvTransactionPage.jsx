import { Button, Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';



function MvTansactionPage(){
    return (
      <>
        <div className='flex justify-center w-full bg-slate-50'>
            <Autocomplete
              size="small"            
              className='mx-4 mt-10'
              renderInput={(params) => (
                <TextField {...params} label="Select"   placeholder="Select Transaction Type" />
              )}
              fullWidth
              sx={{ marginRight: '1rem' }}
              popupIcon={<SearchIcon />} 
            />
        </div>
      
      </>
    )
};

export default MvTansactionPage;