import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

// Destructure props here for cleaner access
function CustomFilter({ options, value, getOptionLabel, onChange, label }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      size="small"
      // Prevent the dropdown list from being bulky
      ListboxProps={{
        sx: {
          "& .MuiAutocomplete-option": {
            fontSize: "12px",
            minHeight: "28px",
            padding: "4px 8px",
          },
        },
      }}
      // Use ChipProps to ensure the tags don't get too wide
      ChipProps={{ 
        size: "small",
        sx: { fontSize: '11px', height: '20px', maxWidth: isFocused ? '120px' : '80px' }
      }}
      sx={{
        // DYNAMIC WIDTH LOGIC
        width: 'auto', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'white',
        borderRadius: '4px',

        "& .MuiOutlinedInput-root": {
          flexWrap: "nowrap", // Crucial: Keeps chips on one line
          overflow: "auto",
          paddingRight: '30px !important', // Leaves room for the arrow
        },

      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            "& .MuiInputLabel-root": { fontSize: "0.75rem" },
            "& .MuiInputBase-input": { fontSize: "0.8rem" }
          }}
        />
      )}
    />
  );
}

export default CustomFilter;