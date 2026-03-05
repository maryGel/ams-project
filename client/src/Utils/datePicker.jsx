import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// MUI
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const getPresetDates = (presetId) => {
  const today = new Date();
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  
  switch(presetId) {
    case 'today':
      const startOfToday = new Date(today);
      startOfToday.setHours(0, 0, 0, 0);
      return [startOfToday, endOfToday];
    
    case 'this-month':
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      return [firstDay, lastDay];
    
    case 'last-30':
      const last30Start = new Date(today);
      last30Start.setDate(last30Start.getDate() - 30);
      last30Start.setHours(0, 0, 0, 0);
      return [last30Start, endOfToday];
    
    case 'last-60':
      const last60Start = new Date(today);
      last60Start.setDate(last60Start.getDate() - 60);
      last60Start.setHours(0, 0, 0, 0);
      return [last60Start, endOfToday];
    
    default:
      return [null, null];
  }
};

const HistoryDatePicker = ({ onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('last-30');
  const [startDate, setStartDate] = useState(() => {
    const [start] = getPresetDates('last-30');
    return start;
  });
  const [endDate, setEndDate] = useState(() => {
    const [, end] = getPresetDates('last-30');
    return end;
  });
  const [displayText, setDisplayText] = useState('Last 30 Days');
  
  const dropdownRef = useRef(null);

    useEffect(() => {
    safeOnDateRangeChange({ startDate, endDate });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    useEffect(() => {
      // Set default to Last 30 Days on mount
      const [start, end] = getPresetDates('last-30');
      setStartDate(start);
      setEndDate(end);

      safeOnDateRangeChange({ startDate: start, endDate: end });
    }, []);



  const safeOnDateRangeChange = (range) => {
    if (onDateRangeChange && typeof onDateRangeChange === 'function') {
      onDateRangeChange(range);
    }
  };

  const options = [
    { id: 'today', label: 'Today' },
    { id: 'this-month', label: 'This Month' },
    { id: 'last-30', label: 'Last 30 Days' },
    { id: 'last-60', label: 'Last 60 Days' },
    { id: 'custom', label: 'Custom Range' }
  ];

 

  const handleOptionSelect = (option) => {
    setSelectedOption(option.id);
    setDisplayText(option.label);
    setIsOpen(false);
    
    if (option.id !== 'custom') {
      const [start, end] = getPresetDates(option.id);
      setStartDate(start);
      setEndDate(end);
      
      if (start && end) {
        safeOnDateRangeChange({ startDate: start, endDate: end });
      }
    } else {
      // Reset dates when switching to custom
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      safeOnDateRangeChange({ startDate: start, endDate: end });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };



  return (
    <div className='flex items-center gap-2 px-4 py-2 font-sans'>
      {/* Dropdown */}
      <div className='relative'ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center justify-between w-32 p-1 text-xs bg-white border rounded-lg cursor-pointer border-spacing-1'
        >
          <span>{displayText}</span>
          <span>{isOpen ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowRightIcon fontSize='small'/> }</span>
        </button>

        {isOpen && (
          <div className= "absolute z-50 w-32 mt-1 bg-white rounded-sm">
            {options.map(option => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`p-1 cursor-pointer text-xs border border-slate-100
                  ${selectedOption === option.id ? 'bg-blue-200' : 'bg-white'}
                  `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Picker - Only shows for Custom Range */}
      {selectedOption === 'custom' && (
        <div >
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            placeholderText="Select date range"
            dateFormat="MMM d, yyyy"
            customInput={
              <input className={`w-40 p-1.5 border border-spacing-1 text-xs outline-none cursor-pointer rounded-md`}
                value={
                  startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : 'Select date range'
                }
                readOnly
              />
            }
            withPortal
          />
        </div>
      )}
    </div>
  );
};

export default HistoryDatePicker;