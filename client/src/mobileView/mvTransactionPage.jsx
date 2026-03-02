import {useState, useEffect, useMemo} from 'react';

// MUI
import { Box, Button, Stack, useTheme, useMediaQuery} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Components
// import {dashItems} from './components/dashItems';

// Hooks
import { useJO_h } from '../hooks/useJO_h';
import { useJO_d } from '../hooks/useJO_d';
import { useRefDepartment  } from '../hooks/refDepartment';
//Custom Utils
import CustomFilter from './customUtils/filters';


// .. Filters ..

const joStatus = [
  {
    id: 1,
    stat: 'Fully Approved',
  },
  {
    id: 2,
    stat: 'Partially Approved',
  },
  {
    id: 3,
    stat: 'Pending',
  }

]


function MvTansactionPage(useProps){

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {joHeaders, isLoading, error} = useJO_h(useProps);
  const {joDetails} = useJO_d(useProps);
  const {refDeptData} = useRefDepartment();
  const [show, setShow] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState([]);

  
  // Map
  const department = useMemo(() => refDeptData.map(item => item.Department), [refDeptData])


  // Selected Filter
  const [filteredStatus, setFilteredStatus] = useState([])
  const [filteredDept, setFilteredDept] = useState([])

   useEffect(() => { const handleScroll = () => { 
    if (window.scrollY > lastScrollY) {  
      setShow(false); 
    } else {  setShow(true); } setLastScrollY(window.scrollY); 
    }; 
    
    window.addEventListener('scroll', handleScroll);     
    return () => window.removeEventListener('scroll', handleScroll); 
  }, [lastScrollY]);


  // .. Handllers ..

  const handleFilterOpen = () => {
    setIsFilterOpen(prev => !prev);
  }

  const handleCloseDetails = () => {
    setIsFilterOpen(false);
  };



    return (
      <>
      <div className='flex flex-col w-full h-screen gap-4 p-4'>
          
          <div className='flex justify-end gap-2'>
            <button onClick={()=> handleFilterOpen(true)}><TuneIcon/></button>
          </div>

          {isFilterOpen && 
            (
            <div className="fixed inset-0 z-50 flex items-center bg-black bg-opacity-50">
                <div className="flex flex-col w-full gap-3 px-3 m-3 text-sm bg-white rounded-lg py-7">
                    <button 
                      onClick={handleCloseDetails}
                      className="flex justify-end text-gray-500 hover:text-gray-700"
                    >
                      <CloseIcon />
                    </button>
                    <span>Filters:</span>
                    <CustomFilter
                      options={joStatus}
                      value={selectedOptions}
                      getOptionLabel={option => option.stat || ''}
                      onChange={(event, newValue) => setSelectedOptions(newValue)}
                      label="Approval Status"
                    />
                    <CustomFilter
                      options={department}
                      value={selectedDept}
                      onChange={(event, newValue) => setSelectedDept(newValue)}
                      label="Department"
                    />  
                    <div className='flex justify-end'>
                      <button className='flex items-center gap-1 px-2 py-1 text-xs tracking-wider border ont-semibold w-50 rounded-2xl border-spacing-1'>
                        <CheckCircleIcon fontSize='small'/>
                        <span className=''>Apply Filter</span>
                      </button>                     
                    </div>  
         
                </div> 
            </div>
             
            )}



        </div>
      
              
      </>
    )
};

export default MvTansactionPage;