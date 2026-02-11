import { TextField, Autocomplete } from '@mui/material'

export default function UseInfo(){


    return (
        <div className='w-full p-2 gap-3border border-spacing-1'>
            <h1 className='mb-4 text-gray-700'>User Information</h1>
            <div className='flex flex-col gap-4 mb-4'>
                <div className='flex gap-2 '>
                    <TextField 
                        label="Username"
                        variant="outlined"
                        size="small"
                        className='w-52'
                    />
                    <TextField 
                        label="Password"
                        variant="outlined"
                        size="small"
                        className='w-52'
                    />
                </div>
                <div className='flex gap-2'>
                    <TextField 
                        label="First Name"
                        variant="outlined"
                        size="small"
                        className='w-80'
                    />
                    <TextField 
                        label="Last Name"
                        variant="outlined"
                        size="small"
                        className='w-80'
                    />
                </div>
                <Autocomplete
                        options={['Sales', 'Engineer', 'Finance', 'Manager']}
                        className='w-64'
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Position"                
                                variant="outlined"
                                size="small"
                            />
                        )}    
                    /> 
                <div className='flex gap-2'>
                    <Autocomplete
                        options={['IT Supplies', 'Front Office', 'Finance']}
                        className='w-64'
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Department"                
                                variant="outlined"
                                size="small"
                            />
                        )}    
                    /> 
                    <Autocomplete
                        options={['Electrical', 'Engineering', 'Plumbing']}
                        className='w-64'
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Maintenance Service"                
                                variant="outlined"
                                size="small"
                            />
                        )}   
                    />                     
                </div>
                    <Autocomplete
                        options={['Admin', 'User']}
                        className='w-64'
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Access Level"                
                                variant="outlined"
                                size="small"
                            />
                        )}   
                    /> 

            </div>


        </div>
    )

};