import {useState, useMemo} from 'react';
// MUI
import TuneIcon from '@mui/icons-material/Tune';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Custom Utils
import HistoryDatePicker from '../../Utils/datePicker';
import DateDisplay from '../../Utils/formatDateForInput';
import {evalStatus} from '../customUtils/filters';
//Components
import MvEvalJO from './mvEvalJO';

const getDefaultLast30Days = () => {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setDate(start.getDate() - 29); // 30 days total
  start.setHours(0, 0, 0, 0);

  return { startDate: start, endDate: end };
};

function MvEvalJOForm({  
    joHeaders,
    joDetails,
}){
    const [filter, setFilter] = useState('Pending');
    const [dateRange, setDateRange] = useState(getDefaultLast30Days); 
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isClosingJO, setIsClosingJO] = useState(false);
    const [selectedJO, setSelectedJO] = useState(null);

     // First, apply the status filter
    const statusFilteredJO = useMemo(() => {
      return joHeaders.filter((jo) => {
        if(filter === 'All') {
          return jo.xpost === 1;
        };
        
        if(filter === 'Pending'){
          return jo.xpost === 1 && !jo.eval_status; 
        }
        if(filter === 'Evaluated'){
          return jo.xpost === 1 && jo.eval_status === 'DONE';
        }

        return false;
      });
    }, [joHeaders, filter]);

    // Then, apply the date filter on top of the status-filtered data
    const filteredJO = useMemo(() => {
      // If no date range is selected, return all status-filtered data
      if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
        return statusFilteredJO;
      }

      const start = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate).setHours(23, 59, 59, 999);

      return statusFilteredJO.filter((jo) => {
        // Check multiple possible date fields
        const joDate = jo.xDate;
        // console.log(`joDate: ${joDate}`)
        
        // If no date field exists, include it (or exclude based on your needs)
        if (!joDate) return null;
        
        const joDateTime = new Date(joDate).getTime();
        return joDateTime >= start && joDateTime <= end;
      });
    }, [statusFilteredJO, dateRange]);

        // Sort the filteredJO array by date (latest first)
    const sortedFilteredJo = useMemo(() => {
        if (!filteredJO) return [];
        
        return [...filteredJO].sort((a, b) => {
            // Sort by JO number in descending order
            // This assumes JO numbers like DB-JO-0000007 (higher number = newer)
            return b.JO_No.localeCompare(a.JO_No);
        });
    }, [filteredJO]);

    // handle open date range selection
    const handleOptionsOpen = () => {
      setIsOptionsOpen(prev => !prev)
    };
    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };

    // Handle animation end
    const handleOpenJo = (header) => {
      setSelectedJO(header);
    };
    // Handle closing a page
    const handleClosePage = () => {
        setIsClosingJO(true);
    };

    // Handle animation end
    const handleAnimationEnd = () => {
        if (isClosingJO) {
            setSelectedJO(null);
            setIsClosingJO(false);
        }
    };

    
    return (
      <>
        <div className='flex flex-col justify-center gap-3'>

          <div className='flex justify-center gap-2 mt-2'>
            {evalStatus.map((item)=> (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.status)}
                  className={`px-4 text-sm border rounded-2xl transition-colors whitespace-nowrap ${
                      filter === item.status 
                      ? 'text-slate-900 font-semibold border-slate-800 bg-slate-100' 
                      : 'bg-white text-slate-600 border-slate-400'
                  }`}
                >
                <div className='flex items-center gap-1'>
                  <img className='w-4 h-4' src={item.icon}/>
                  <span>{item.status}</span>
                </div>
                </button>
              ))}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center justify-end px-4 text-sm font-semibold tracking-wide'>
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
              <div className='mt-2 border-t border-b bg-gray-50'>
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
                <span>Results: <strong>{filteredJO.length}</strong></span>
              </div>
            </div>
          )}
        </div>  

        {/* Job orders List  */}

        <div className='mt-3 border-t'>
          {sortedFilteredJo?.map((header ) => {
            
            return (
              <div 
                key={header.ID} 
                className='grid grid-cols-[22rem_1fr] justify-between h-auto text-sm px-3 py-1 border-b'
                onClick={()=> {handleOpenJo(header)}}>
                <div className='flex flex-col h-auto '>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>{header.JO_No}</span>
                    <span><DateDisplay value={header.xDate} format="short" /></span>
                  </div>
                  <span className='pl-2'>{header.Remarks}</span>
                  <span className='text-[10px] pl-2 text-slate-500'>{header.Department_Code}</span>
                </div>
                <button className='p-2' >
                  <ArrowForwardIosIcon className='p-1 text-blue-800' fontSize='small'/>
                </button>
              </div>
            )
          })}
            {selectedJO &&
                (<MvEvalJO 
                  onClose={handleClosePage}
                  onAnimationEnd={handleAnimationEnd}
                  isClosingJO={isClosingJO}
                  header = {selectedJO}
                  joDetails = {joDetails}
                />)
            }
        </div>
      </>
    )
}

export default MvEvalJOForm;