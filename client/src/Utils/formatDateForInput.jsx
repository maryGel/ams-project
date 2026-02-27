import { format, parseISO } from 'date-fns';

export const formatDateForInput = (dateString, formatType = 'P') => {
  if (!dateString) return '';
   
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const formats = {
    short: date.toLocaleDateString(), // MM/DD/YYYY
    iso: date.toISOString().split('T')[0], // YYYY-MM-DD
    long: date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), // January 1, 2024
    custom: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` // Custom format
  };
  
  return formats[format] || formats.short;
  
};

// Date Formatter Component
const DateDisplay = ({ value, format = 'short' }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    switch(format) {
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'iso':
        return date.toISOString().split('T')[0];
      default:
        return date.toLocaleDateString();
    }
  };

  return <span>{formatDate(value)}</span>;
};

export default DateDisplay;