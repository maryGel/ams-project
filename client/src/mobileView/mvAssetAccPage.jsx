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
import MvAAForm from './components/mvAAForm';



function MvAssetAccPage({
    onClose,
    isClosing,
    onAnimationEnd,
    assetAccHeaders = [],
    assetAccDetails =[],
    isLoading = false,
    error = null,
}){
    const [show, setShow] = useState(true); 
    const [filter, setFilter] = useState('Waiting');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [dateRange, setDateRange] = useState(getDefaultLast30Days); //state for date range

    const handleClosePage = () => {if(onClose) onClose()}; 
    const handleAnimationEnd = (e) => {
        // Only trigger if the animation that ended belongs to THIS div
        if (isClosing && e.target === e.currentTarget) { 
            setIsOpenAssetAcct(false);  
        } 
    };

    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };

    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };

    // First, apply the status filter
    const statusFilteredAA = useMemo(() => {
      return assetAccHeaders.filter((aa) => {
        if(filter === 'All') return true;
        
        if(filter === 'Waiting'){
          return (aa.xPosted === 3 || aa.xPosted === 2) && aa.DISAPPROVED === 0; 
        }
        if(filter === 'Fully Approved'){
          return aa.xPosted === 1 && aa.DISAPPROVED === 0;
        }
        if(filter === 'Rejected'){
          return (aa.xPosted === 3 || aa.xPosted ===2) && aa.DISAPPROVED === 1;
        }

        return false;
      });
    }, [assetAccHeaders, filter]);

    // Then, apply the date filter on top of the status-filtered data
    const filteredAA= useMemo(() => {
      // If no date range is selected, return all status-filtered data
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        return statusFilteredAA;
      }

      const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      return statusFilteredAA.filter((aa) => {
        // Check multiple possible date fields
        const adDate = aa.xDate;
        
        // If no date field exists
        if (!adDate) return true;
        
        const adDateTime = new Date(adDate).getTime();
        return adDateTime >= start && adDateTime <= end;
      });
    }, [statusFilteredAA, dateRange]);

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
                  bgcolor: 'white',
                  transition: 'transform 0.3s ease',
                  transform: show ? 'translateY(0)' : 'translateY(-100%)',  
                  backgroundColor: '#fafafa',        
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
                    className={`px-4 text-sm border py-0.5 rounded-2xl transition-colors whitespace-nowrap ${
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
                <span>Asset Accountability</span>
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
                  <span>Results: <strong>{filteredAA.length}</strong></span>
                </div>
              </div>
            )}
            
            {isLoading 
              ? (<div className='flex justify-center p-8'>Loading...</div>) 
              : error ? (<div className='p-4 m-4 text-red-500 bg-red-100 rounded'>{error}</div>) 
              : filteredAA.length > 0
              ? <div className='flex flex-col gap-4 p-4'>
                  <MvAAForm
                    filteredAA = {filteredAA}
                    assetAccDetails = {assetAccDetails}
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

export default MvAssetAccPage;