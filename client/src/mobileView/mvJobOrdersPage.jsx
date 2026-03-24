// mvJobOrdersPage.jsx
import { useState, useMemo, useEffect } from 'react';
// MUI
import { Box, Stack, TextField, InputAdornment } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
// Custom Utils
import HistoryDatePicker from '../Utils/datePicker';
import {getDefaultLast30Days} from '../Utils/datePicker';
import {statusFilter} from './customUtils/filters';
// Components
import MvJOForm from './components/mvJOForm';

// Search Overlay Component
const SearchOverlay = ({ isOpen, onClose, joHeaders, onSelectJO }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Filter JO headers by JO number
    const results = joHeaders.filter((jo) => {
      const joNumber = jo.JO_No  || '';
      return joNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    setSearchResults(results);
  }, [searchTerm, joHeaders]);

  const handleSelectJO = (jo) => {
    onSelectJO(jo);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 mt-20 bg-white rounded-lg shadow-xl animate-slide-down">
        {/* Search Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Search Job Order</h3>
          <button
            onClick={handleClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Enter JO number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-600">
                Found {searchResults.length} result(s)
              </div>
              <div className="overflow-y-auto max-h-96">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.ID || result.JO_No}
                        onClick={() => handleSelectJO(result)}
                        className="p-3 transition-colors border rounded-lg cursor-pointer hover:bg-blue-50"
                      >
                        <div className="font-semibold text-blue-600">
                          {result.JO_No}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {result.Department_Code || result.department}
                        </div>
                        {result.Remarks && (
                          <div className="mt-1 text-xs text-gray-500">
                            Remarks: {result.Remarks}
                          </div>
                        )}
                        {result.requested_by && (
                          <div className="mt-1 text-xs text-gray-500">
                            Requestor: {result.requested_by}
                          </div>
                        )}
                        {result.xDate && (
                          <div className="mt-1 text-xs text-gray-500">
                            Date: {new Date(result.xDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No matching JO numbers found
                  </div>
                )}
              </div>
            </div>
          )}

          {!searchTerm && (
            <div className="py-8 text-center text-gray-400">
              <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <p className="mt-2">Start typing a JO number to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function MvJobOrderPage({
    onClose,
    isClosing,
    onAnimationEnd,
    joHeaders = [],
    joDetails = [],
    isLoading = false,
    error = null,
}){
    const [filter, setFilter] = useState('Waiting');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [dateRange, setDateRange] = useState(getDefaultLast30Days);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedJO, setSelectedJO] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const handleClosePage = () => {
        if (onClose) onClose();
    };

    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };

    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };

    const handleSearchClick = () => {
      setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
      setIsSearchOpen(false);
    };

    const handleSelectJO = (jo) => {
      setSelectedJO(jo);
      setIsSearchActive(true);
      setIsSearchOpen(false);
    };

    const handleClearSearch = () => {
      setSelectedJO(null);
      setIsSearchActive(false);
    };

    // First, apply the status filter
    const statusFilteredJO = useMemo(() => {
      return joHeaders.filter((jo) => {
        if(filter === 'All') return true;
        
        if(filter === 'Waiting'){
          return jo.xpost === 3 && jo.DISAPPROVED === 0; 
        }
        if(filter === 'Fully Approved'){
          return jo.xpost === 1 && jo.DISAPPROVED === 0;
        }
        if(filter === 'Rejected'){
          return jo.DISAPPROVED === 1;
        }
        return false;
      });
    }, [joHeaders, filter]);

    // Then, apply the date filter
    const dateFilteredJO = useMemo(() => {
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        return statusFilteredJO;
      }

      const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      return statusFilteredJO.filter((jo) => {
        const joDate = jo.xDate;
        if (!joDate) return null;
        const joDateTime = new Date(joDate).getTime();
        return joDateTime >= start && joDateTime <= end;
      });
    }, [statusFilteredJO, dateRange]);

    // Final data: show selected JO if search is active, otherwise show filtered data
    const displayData = useMemo(() => {
      if (isSearchActive && selectedJO) {
        return [selectedJO]; // Return as array to maintain compatibility with MvJOForm
      }
      return dateFilteredJO;
    }, [isSearchActive, selectedJO, dateFilteredJO]);

    return (
      <>
        <div 
          onAnimationEnd={onAnimationEnd}
          className={`fixed inset-0 z-50 w-full h-full overflow-y-auto bg-white shadow-xl ${
            isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}
        >
          <div className="flex flex-col min-h-full">
            <Box 
              sx={{ 
                p: 2,
                pt: 3,
                overflow: 'auto', 
                borderBottom: 1, 
                borderColor: 'grey.300', 
                position: 'sticky', 
                top: 0, 
                bgcolor: '#fafafa',
                zIndex: 10
              }}
            >
              <Stack
                direction="row" 
                minWidth='max-content'
                spacing={1.5}
                sx={{
                  justifyContent: 'flex-start',
                  px: 1,
                  overflowX: 'auto',
                  alignItems: 'center'
                }}              
              >
                <button className='w-5' onClick={handleClosePage}> 
                  <ArrowBackIosIcon fontSize='small'/>
                </button>
                <button 
                  className='w-5 transition-colors hover:text-blue-600'
                  onClick={handleSearchClick}
                >
                  <SearchIcon/>
                </button>
                {statusFilter.map((item)=> (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFilter(item.status);
                      // Clear search when changing filters
                      if (isSearchActive) {
                        handleClearSearch();
                      }
                    }}
                    className={`px-2 py-0.5 text-sm border rounded-2xl transition-colors whitespace-nowrap ${
                        filter === item.status && !isSearchActive
                        ? 'text-slate-900 font-semibold border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-400'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className='pl-1 text-xs tracking-wide'>{item.status}</span>
                  </button>
                ))}
              </Stack>
            </Box>
            
            {/* Date Range Filter - Hide when search is active */}
            {!isSearchActive && (
              <>
                <div className='grid-cols-1 py-2'>
                  <div className='flex items-center justify-between px-4 text-sm font-semibold tracking-wide'>
                    <span>Job Orders</span>
                    <button 
                      onClick={handleOptionsOpen}
                      className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                        isOptionsOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <TuneIcon fontSize='small' />
                      <span className='text-xs'>Filter</span>
                    </button>
                  </div>
                  
                  {isOptionsOpen && (
                    <div className='flex m-1 border-t border-b bg-gray-50'>
                      <HistoryDatePicker onDateRangeChange={handleDateRangeChange} />
                    </div>
                  )}
                </div>

                {(filter !== 'All' || dateRange) && (
                  <div className='px-4 py-2 text-xs text-gray-600 border-blue-100 bg-blue-50 border-y'>
                    <div className='flex items-center gap-2'>
                      {dateRange?.startDate && dateRange?.endDate && (
                        <>
                          <span>|</span>
                          <span>
                            Date: <strong>
                              {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                            </strong>
                          </span>
                        </>
                      )}
                      <span>|</span>
                      <span>Results: <strong>{displayData.length}</strong></span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Search Active Indicator */}
            {isSearchActive && selectedJO && (
              <div className='px-4 py-2 text-xs text-blue-600 border-blue-100 bg-blue-50 border-y'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <SearchIcon fontSize='small' />
                    <span>Search Results: <strong>{selectedJO.JO_No}</strong></span>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className='text-xs text-blue-600 underline hover:text-blue-800'
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className='flex justify-center p-8'>Loading...</div>
            ) : error ? (
              <div className='p-4 m-4 text-red-500 bg-red-100 rounded'>{error}</div>
            ) : displayData.length > 0 ? (
              <div className='flex flex-col gap-4 p-4'>
                <MvJOForm 
                  useProps={null}
                  joHeaders={joHeaders}
                  filteredJO={displayData}
                  isLoading={isLoading}
                  error={error}
                  joDetails={joDetails}
                />  
              </div>
            ) : (
              <span className='flex justify-center p-5 text-sm italic item-center text-slate-500'>
                {isSearchActive 
                  ? 'No JO record found with that number.' 
                  : 'No record found within the selected date.'}
              </span>
            )}                        
          </div>            
        </div>

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={handleSearchClose}
          joHeaders={joHeaders}
          onSelectJO={handleSelectJO}
        />
      </>
    )
}

export default MvJobOrderPage;