// autocompleteStyles.js
export const getAutocompleteSx = (isEditing) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isEditing ? 'white' : 'transparent',

    '& fieldset': {
      border: isEditing ? undefined : 'none',
      borderColor: isEditing ? 'rgba(0, 0, 0, 0.23)' : undefined,
    },

    '&:hover fieldset': {
      borderColor: isEditing ? 'rgba(0, 0, 0, 0.87)' : undefined,
    },

    '&.Mui-focused fieldset': {
      borderColor: isEditing ? '#1976d2' : undefined,
      borderWidth: isEditing ? 2 : 0,
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '.9rem',
  },
});
