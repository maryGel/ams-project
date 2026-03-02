import { useState, useMemo } from 'react';
// MUI
import { Box, Button, Stack, Menu, MenuItem} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
// Custom Utils
import HistoryDatePicker from '../Utils/datePicker';
// Components
import MvTRForm from './components/mvTRForm';


function MvTransferPage({
    setIsOpenTransfer,
    trHeaders,
    trDetails,

}){
    const [isClosing, setIsClosing] = useState(false);
    const [show, setShow] = useState(true); 
    const [filter, setFilter] = useState('Waiting');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [dateRange, setDateRange] = useState(null); //state for date range

    const handleClosePage = () => setIsClosing(true); 
    const handleAnimationEnd = (e) => {
        // Only trigger if the animation that ended belongs to THIS div
        if (isClosing && e.target === e.currentTarget) { 
            setIsOpenTransfer(false);  
        } 
    };

    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };

    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };

    // First, apply the status filter
    const statusFilteredTR = useMemo(() => {
      return trHeaders.filter((tr) => {
        if(filter === 'All') return true;
        
        if(filter === 'Waiting'){
          return (tr.xpost === 3 || tr.xpost === 2) && tr.DISAPPROVED === 0; 
        }
        if(filter === 'Fully Approved'){
          return tr.xpost === 1 && tr.DISAPPROVED === 0;
        }
        if(filter === 'Rejected'){
          return (tr.xpost === 3 || tr.post ===2) && tr.DISAPPROVED === 1;
        }

        return false;
      });
    }, [trHeaders, filter]);

    // Then, apply the date filter on top of the status-filtered data
    const filteredTR= useMemo(() => {
      // If no date range is selected, return all status-filtered data
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        return statusFilteredTR;
      }

      const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      return statusFilteredTR.filter((tr) => {
        // Check multiple possible date fields
        const trDate = tr.xDate;
        
        // If no date field exists
        if (!trDate) return true;
        
        const trDateTime = new Date(trDate).getTime();
        return trDateTime >= start && trDateTime <= end;
      });
    }, [statusFilteredTR, dateRange]);

    return (
      <>
        <div onAnimationEnd={handleAnimationEnd} className={`          
          fixed inset-0 z-50 items-start w-full max-h-screen overflow-y-auto 
          bg-white  ${isClosing ? 'animate-slide-out-left' : 'animate-slide-left '}`}>
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
            
            <div className='flex flex-col py-2'>
              <div className='flex justify-end px-4'>
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
                  <span>Results: <strong>{filteredTR.length}</strong></span>
                </div>
              </div>
            )}
            
            <div className='flex flex-col gap-4 p-4'>
              <MvTRForm
                trHeaders = {trHeaders}
                trDetails = {trDetails}
                filteredTR = {filteredTR}
              />
            </div>               
          </div>            
        </div>        
      </>
    )
}

export default MvTransferPage;