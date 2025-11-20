import * as React from 'react';
import  {useState, useMemo}  from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';

// useEffect (fetch API using axios)
// import {useAssetMasterData} from '../../hooks/assetMasterHooks'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 1,
    numeric: false,
    disablePadding: true,
    label: 'Asset Number',
  },
  {
    id: 2,
    numeric: true,
    disablePadding: false,
    label: 'Asset Name',
  },
  {
    id: 3,
    numeric: true,
    disablePadding: false,
    label: 'Asset Class',
  },
  {
    id: 4,
    numeric: true,
    disablePadding: false,
    label: 'Asset Group',
  },
  {
    id: 5,
    numeric: true,
    disablePadding: false,
    label: 'Quantity',
  },
  {
    id: 6,
    numeric: true,
    disablePadding: false,
    label: 'UOM',
  },
  {
    id: 7,
    numeric: true,
    disablePadding: false,
    label: 'Location',
  },
  {
    id: 8,
    numeric: true,
    disablePadding: false,
    label: 'Department',
  },
  {
    id: 9,
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {props.rowCount > 0 && (
            <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx ={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Asset Master List
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


// ----------------------------------------------------------------
//                    A S S E T  T A B L E 
// ----------------------------------------------------------------


export default function AssetMasterTable({ 
    // itemList, 
    loading, 
    error,
    displayedAsset,
    page,
    setPage,
    // searchQuery,
    isTableActive
  }) {
  // MUI States
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // // New State for API Data
  // const {itemList, loading, error} = useAssetMasterData(assetProps)


  //Data fetching for API Data 
  const navigate = useNavigate();

  // const placeholderRows = Array.from({ length: rowsPerPage }).map(() => ({
  //   id: Math.random(),
  //   FacNO: "",
  //   FacName: "",
  //   ItemClass: "",
  //   CATEGORY: "",
  //   balance_unit: "",
  //   Unit: "",
  //   ItemLocation: "",
  //   Department: "",
  //   status: ""
  // }));  
  

  const rows = displayedAsset;


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.FacNO || n.id); // Use FacNO if available, otherwise id    
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleSelectItem = (row) => {
    const facNo = row.FacNO || row.FacNo;

    // Navigate to display page
    navigate(`/assetFolder/assetMasterDisplay/${facNo}`);
  }; 


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const visibleRows = useMemo(
    () => { 
      // ➡️ NEW/MODIFIED: If the table is not active, return the placeholders immediately.
      if (!isTableActive) {
        return [];
      }
      
      // If the table IS active, proceed with sorting and pagination of the actual data
      return [...rows]
          .sort(getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    },
  
    // ➡️ Add the new flag to the dependency array
    [rows, order, orderBy, page, rowsPerPage, isTableActive] 
  );

  if(loading){
    return (
      <Box sx={{ width: '100%',  padding: 2}}>
        <Typography variant="h6" align="center">
          Loading Asset Master Data...
        </Typography>
      </Box>
    )
  }

  if(error){
    return (
      <Box sx={{ width: '100%', padding: 2, textAlign: 'center' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

 
  
  return (
    <Box sx={{ width: '100%',  padding: 2}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750  }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}  
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}          
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const uniqueId = row.FacNO || row.id;
                const isItemSelected = selected.includes(uniqueId);
                const labelId = `enhanced-table-checkbox-${index}`;
                // const isPlaceholder = row.FacNO === "";

                return (
                  <TableRow
                    key = {row.id}
                    hover   // disable hover for blank rows
                    onClick={(event) => handleClick(event, uniqueId)}                    
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell 
                      padding="checkbox"
                      sx={{ width: 25 }}
                      onClick={(event) => handleClick(event, uniqueId)}
                    >
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, uniqueId)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{ 
                        fontWeight: 'bold', color: 'primary.main', textDecoration: 'underline',                      
                        '&:Hover': {fontSize: '1rem', color: '#43a047'}
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(row);
                      }}
                    >
                      {row.FacNO || ""}
                    </TableCell>
                    <TableCell align="left">{row.FacName}</TableCell>
                    <TableCell align="left">{row.ItemClass}</TableCell>
                    <TableCell align="left">{row.CATEGORY}</TableCell>
                    <TableCell align="left">{row.balance_unit}</TableCell>
                    <TableCell align="left">{row.Unit}</TableCell>
                    <TableCell align="left">{row.ItemLocation}</TableCell>
                    <TableCell align="left">{row.Department}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>                    
                  </TableRow> 
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
