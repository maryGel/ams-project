import { DataGrid } from '@mui/x-data-grid';


const columns = [
    { field: 'id', headerName: 'ID', width: 70},
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'auth', headerName: 'Access Level', width: 200 },
]

const rows = [
    { id: 1, username: 'Drei', auth: 'Admin' },
    { id: 2, username: 'Gel', auth: 'User' },
    { id: 3, username: 'John Rey', auth: 'User' },
    { id: 4, username: 'Miguel', auth: 'User' },
    { id: 5, username: 'Rafael', auth: 'User' },
    { id: 6, username: 'Maria', auth: 'User' },
    { id: 7, username: 'Ana', auth: 'User' },
    { id: 8, username: 'Carlos', auth: 'User' },
    { id: 9, username: 'Luis', auth: 'User' },
    { id: 10, username: 'Elena', auth: 'User' },
    { id: 11, username: 'Diego', auth: 'User' },
    { id: 12, username: 'Sofia', auth: 'User' },
    { id: 13, username: 'Andres', auth: 'User' },
    { id: 14, username: 'Isabella', auth: 'User' },
    { id: 15, username: 'Mateo ', auth: 'User' },
    { id: 16, username: 'Gel', auth: 'User' },
];

export default function UseList(){

    return (
        <div className='w-full h-96'>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                hideFooterSelectedRowCount

                pagination
                pageSizeOptions={[5, 10, 20, 50]}
                initialState={{
                    pagination: {
                    paginationModel: { pageSize: 10 },
                    },
                    sorting: {
                    sortModel: [{ field: 'id', sort: 'asc' }],
                    },
                }}

                // styles
                sx ={{
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                    },
                }}
            />
            
        </div>
    )

};