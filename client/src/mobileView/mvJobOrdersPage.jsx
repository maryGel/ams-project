// mvJobOrdersPage.jsx
import { useState, useMemo, useEffect } from 'react';
// MUI
import { Box, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
// Custom Utils
import HistoryDatePicker from '../Utils/datePicker';
// Components
import MvJOForm from './components/mvJOForm';

const getDefaultLast30Days = () => {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  const start = new Date(today);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  return { startDate: start, endDate: end };
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

    const handleClosePage = () => {
        if (onClose) onClose();
    };

    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };

    const handleDateRangeChange = (range) => {
      setDateRange(range);
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
    const filteredJO = useMemo(() => {
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


    return (
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
              <button className='w-5'>
                <SearchIcon />
              </button>
              {['Waiting', 'Fully Approved', 'Rejected', 'All'].map((status)=> (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 text-sm border rounded-2xl transition-colors whitespace-nowrap ${
                      filter === status 
                      ? 'text-blue-600 font-semibold border-blue-800' 
                      : 'bg-white text-slate-600 border-slate-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </Stack>
          </Box>
          
          {/* Date Range Filter */}
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
                <span>Results: <strong>{filteredJO.length}</strong></span>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className='flex justify-center p-8'>Loading...</div>
          ) : error ? (
            <div className='p-4 m-4 text-red-500 bg-red-100 rounded'>{error}</div>
          ) : filteredJO.length > 0 ? (
            <div className='flex flex-col gap-4 p-4'>
              <MvJOForm 
                joHeaders={joHeaders}
                filteredJO={filteredJO}
                isLoading={isLoading}
                error={error}
                joDetails={joDetails}
              />  
            </div>
          ) : (
            <span className='flex justify-center p-5 text-sm italic item-center text-slate-500'>
              No record found within the selected date. 
            </span>
          )}                        
        </div>            
      </div>        
    )
}

export default MvJobOrderPage;