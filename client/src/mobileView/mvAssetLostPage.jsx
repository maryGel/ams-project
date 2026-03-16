import { useState, useMemo } from 'react';
// MUI
import { Box, Stack, } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
// Custom Utils
import HistoryDatePicker from '../Utils/datePicker';
import {getDefaultLast30Days} from '../Utils/datePicker';
import {statusFilter} from './customUtils/filters';
// Components
import MvALForm from './components/mvALForm';



function MVAssetLostPage({
    onClose,
    isClosing,
    onAnimationEnd,
    assetLostHeaders = [],
    assetLostDetails = [],
    isLoading = false,
    error = null,

}){
    const [filter, setFilter] = useState('Waiting');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [dateRange, setDateRange] = useState(getDefaultLast30Days); //state for date range

    const handleClosePage = () => {if(onClose) onClose()}; 

    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };

    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };

    // First, apply the status filter
    const statusFilteredAL = useMemo(() => {
      return assetLostHeaders.filter((al) => {
        if(filter === 'All') return true;
        
        if(filter === 'Waiting'){
          return (al.xPosted === 3 || al.xPosted === 2) && al.DISAPPROVED === 0; 
        }
        if(filter === 'Fully Approved'){
          return al.xPosted === 1 && al.DISAPPROVED === 0;
        }
        if(filter === 'Rejected'){
          return (al.xPosted === 3 || al.post ===2) && al.DISAPPROVED === 1;
        }

        return false;
      });
    }, [assetLostHeaders, filter]);

    // Then, apply the date filter on top of the status-filtered data
    const filteredAL= useMemo(() => {
      // If no date range is selected, return all status-filtered data
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        return statusFilteredAL;
      }

      const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      return statusFilteredAL.filter((al) => {
        // Check multiple possible date fields
        const adDate = al.xDate;
        
        // If no date field exists
        if (!adDate) return true;
        
        const adDateTime = new Date(adDate).getTime();
        return adDateTime >= start && adDateTime <= end;
      });
    }, [statusFilteredAL, dateRange]);

    return (
      <>
        <div onAnimationEnd={onAnimationEnd} className={`          
          fixed inset-0 z-50 items-start w-full max-h-screen overflow-y-auto 
          bg-white  ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
          <div className="flex flex-col ">
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
                minWidth= 'max-content'
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
                {statusFilter.map((item)=> (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.status)}
                    className={`px-2 text-sm py-0.5 border rounded-2xl transition-colors whitespace-nowrap ${
                        filter === item.status 
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
            
            <div className='flex flex-col py-2'>
              <div className='flex items-center justify-between px-4 text-sm font-semibold tracking-wide'>
                <span>Lost Assets</span>
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
                <div className='m-1 border-t border-b bg-gray-50'>
                  <HistoryDatePicker onDateRangeChange={handleDateRangeChange} />
                </div>
              )}
            </div>

            {/* Filter Summary - Optional but helpful */}
            {(filter !== 'All' || dateRange) && (
              <div className='px-4 py-2 text-xs text-gray-600 border-blue-100 bg-blue-50 border-y'>
                <div className='flex items-center gap-2'>
                  {/* <span>Status: <strong>{filter}</strong></span> */}
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
                  <span>Results: <strong>{filteredAL.length}</strong></span>
                </div>
              </div>
            )}
            
          {isLoading ? (
            <div className='flex justify-center p-8'>Loading...</div>
          ) : error ? (
            <div className='p-4 m-4 text-red-500 bg-red-100 rounded'>{error}</div>
          ) : filteredAL.length > 0 
              ? <div className='flex flex-col gap-4 p-4'>
                  <MvALForm
                    assetLostDetails = {assetLostDetails}
                    filteredAL = {filteredAL}
                  />
                </div>  
              : <span className='flex justify-center p-5 text-sm italic item-center text-slate-500'>
                  No record found within the selected date. 
                </span>
            }             
          </div>            
        </div>        
      </>
    )
}

export default MVAssetLostPage;