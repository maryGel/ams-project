import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



function createData(id, docDate, postingDate, docNum, docType) {
  return { id, docDate, postingDate, docNum, docType };
}

const rows = [
  createData('1', '01/01/2024', '01/01/2024', '93849402', 'Goods receipt'),
  createData('2', '02/01/2024', '02/01/2024', '93849402', 'Job order'),
  createData('3', '03/01/2024', '03/01/2024', '93849402', 'Asset Disposal'),
  createData('4', '04/01/2024', '04/01/2024', '93849402', 'Transfer'),
  createData('5', '05/01/2024', '05/01/2024', '93849402', 'Retirement'),
];

export default function AssetDisplayTrans(){  
  return(
    <div className='p-5'>
      <div className='pt-5 pb-5 text-base shadow-sm shadow-slate-200'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300, width: '40rem' }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ color: 'text.primary' }}>
                <TableCell>Doc. Date</TableCell>
                <TableCell align="right">Date Posted</TableCell>
                <TableCell align="right">Doc. Number</TableCell>
                <TableCell align="right">Depreciation Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell >{row.docDate}</TableCell>
                  <TableCell align="right">{row.postingDate}</TableCell>
                  <TableCell align="right" sx={{color: 'blue', textDecoration: 'underline'}}>{row.docNum}</TableCell>
                  <TableCell align="right">{row.docType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>   
      </div>
    </div>
  )
}