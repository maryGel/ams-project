import { TextField, Checkbox, FormControlLabel, InputAdornment } from '@mui/material';

export default function UserInfo({ 
  userData,           // This comes from formData in the reducer
  isEditing, 
  onUserChange,       // This will be updateForm from the reducer
  isCreating,
}) {
 
  const handleChange = (field, value) => {
    if (!isEditing) return;
    
    const updatedData = { ...userData, [field]: value };
    onUserChange(updatedData);  // Just call onUserChange, no need for setFormData
  };

  // Show empty state when no user is selected and not creating
  if (!userData && !isCreating) {
    return (
      <div className='w-full gap-3 p-2 border border-spacing-1'>
        <h1 className='mb-4 text-gray-700'>User Information</h1>
        <p className='py-8 text-center text-gray-500'>Select a user to view details</p>
      </div>    
    );
  }

  // If we're creating, use empty object as fallback
  const displayData = userData || {};

  return (
    <div className='w-full gap-3 p-2'>
      <h1 className='mb-4 text-gray-700'>
        User Information 
        {isEditing && !isCreating && (
          <span className='ml-2 text-sm text-blue-500'>(Editing Mode)</span>
        )}
        {isCreating && (
          <span className='ml-2 text-sm text-green-500'>(Creating New User)</span>
        )}
      </h1>
      
      <div className='flex flex-col gap-4 mb-4'>
        {/* Username and Password Row */}
        <div className='flex gap-2'>
          <TextField
            label="Username"
            variant="outlined"
            size="small"
            className='w-52'
            value={displayData.user || ''}  // Fixed: was userData.userData
            disabled={!isEditing}
            onChange={(e) => handleChange('user', e.target.value)}  // Fixed: was 'userData'
            required={isCreating}
          />
          <TextField
            label="Password"
            variant="outlined"
            size="small"
            className='w-52'
            type="password"
            value={displayData.password || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('password', e.target.value)}
            required={isCreating}
            placeholder={!isCreating && !displayData.password ? "••••••••" : ""}
            InputProps={{
              startAdornment: (!isCreating && !displayData.password && !isEditing) ? (
                <InputAdornment position="start">
                  <span className='text-gray-400'>••••••••</span>
                </InputAdornment>
              ) : null,
            }}
          />
        </div>

        {/* Name Fields */}
        <div className='flex gap-2'>
          <TextField
            label="First Name"
            variant="outlined"
            size="small"
            className='w-80'
            value={displayData.fname || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('fname', e.target.value)}
          />
          <TextField
            label="Middle Name"
            variant="outlined"
            size="small"
            className='w-80'
            value={displayData.mname || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('mname', e.target.value)}
          />
        </div>

        <div className='flex gap-2'>
          <TextField
            label="Last Name"
            variant="outlined"
            size="small"
            className='w-80'
            value={displayData.lname || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('lname', e.target.value)}
          />
        </div>

        {/* Position and Department */}
        <div className='flex gap-2'>
          <TextField
            label="Position"
            variant="outlined"
            size="small"
            className='w-64'
            value={displayData.xPosi || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('xPosi', e.target.value)}
          />
          <TextField
            label="Department"
            variant="outlined"
            size="small"
            className='w-64'
            value={displayData.xDept || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('xDept', e.target.value)}
          />
        </div>

        {/* Access Level and Section */}
        <div className='flex gap-2'>
          <TextField
            label="Access Level"
            variant="outlined"
            size="small"
            className='w-64'
            value={displayData.xlevel || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('xlevel', e.target.value)}
          />
          <TextField
            label="Section"
            variant="outlined"
            size="small"
            className='w-64'
            value={displayData.xSection || ''}
            disabled={!isEditing}
            onChange={(e) => handleChange('xSection', e.target.value)}
          />
        </div>

        {/* Checkboxes - Add more if needed */}
        <div className='flex gap-4'>
          <FormControlLabel
            control={
              <Checkbox
                checked={displayData.Approver === 1}
                disabled={!isEditing}
                onChange={(e) => handleChange('Approver', e.target.checked ? 1 : 0)}
              />
            }
            label="Approver"
          />
          
          {/* Add Admin checkbox if it exists in your data */}
          {displayData.hasOwnProperty('Admin') && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={displayData.Admin === 1}
                  disabled={!isEditing}
                  onChange={(e) => handleChange('Admin', e.target.checked ? 1 : 0)}
                />
              }
              label="Admin"
            />
          )}

          {/* Add Log checkbox if it exists in your data */}
          {displayData.hasOwnProperty('Log') && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={displayData.Log === 1}
                  disabled={!isEditing}
                  onChange={(e) => handleChange('Log', e.target.checked ? 1 : 0)}
                />
              }
              label="Log"
            />
          )}
        </div>
      </div>
    </div>
  );
}