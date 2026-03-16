import {useState} from 'react';
// MUI
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// Custom Utils
import DateDisplay from '../../Utils/formatDateForInput';

function MvWorkOrders({
    onClose,
    onAnimationEnd,
    header,
    joDetails,
    isClosingJO
}){

    // State for selected items
    const [selectedItems, setSelectedItems] = useState([]);

    // Filter joDetails by JO_No & Approval logs by JO_No
    const getItemsByJONo = (JO_No) => {
        return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
    };

    const items = getItemsByJONo(header.JO_No);

    // Check if all items are selected
    const isAllSelected = items.length > 0 && selectedItems.length === items.length;

    // Handle individual item selection
    const handleItemSelect = (item, index) => {
        const itemId = `${item.JO_No}-${index}`; // Create unique identifier
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            const allItemIds = items.map((item, index) => `${item.JO_No}-${index}`);
            setSelectedItems(allItemIds);
        }
    };

    // Check if a specific item is selected
    const isItemSelected = (item, index) => {
        return selectedItems.includes(`${item.JO_No}-${index}`);
    };

    return (
    <>
          <div onAnimationEnd={onAnimationEnd} className={`          
          fixed inset-0 z-50 items-start w-full max-h-screen overflow-y-auto text-sm
          bg-white ${isClosingJO ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
            
          <div className='p-5'>
              <button className='w-3' onClick={onClose}> 
                  <ArrowBackIosIcon fontSize='small'/>
              </button>
          </div>
          <div className='flex justify-between px-5 py-2 font-sans tracking-wide border-b'>
            <div>
              <span>{header.JO_No}</span>
              {header.workNo && <span className='text-green-600'> - {header.workNo}</span>}
            </div>
            <span><DateDisplay value={header.xDate} format="short" /></span>
          </div>
          <div className='flex flex-col gap-3 p-5 text-sm border-b text-slate-500'>
            <span>{header.Department_Code}</span>
            <span className='text-base text-black'>Remarks: {header.Remarks}</span>
            <div className='flex flex-col gap-1 mt-1' >
              <span >For inpection by: {header.Sector_name}</span>
              <span>Requestor: {header.requested_by}</span>
            </div>
          </div>
         
          <div className='px-3 py-1'>
            {/* <div className='flex items-center justify-between'>
              {items.length > 0 && (
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    size="small"
                    color="primary"
                  />
                  <span className='text-sm text-slate-600'>Select All</span>
                </div>                
              )}
                <div className={`px-3 py-1 tracking-wide rounded-md shadow-md ${selectedItems.length > 0 ? 'bg-green-600 text-white' : 'text-green-600 border border-green-600'}`}>
                  <button className={`flex gap-1 `}><DriveFileRenameOutlineIcon fontSize='small'/>Evaluate</button>
                </div>
            </div> */}
            
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col py-1 mb-2 rounded-lg cursor-pointer transition-colors duration-200`}
                  // ${isItemSelected(item, index) 
                  //   ? 'bg-blue-50 border border-blue-200' 
                  //   : 'hover:bg-gray-50 border border-transparent'
                  // }`}
                // onClick={() => handleItemSelect(item, index)}
              >
                <div className='flex items-center gap-1 pl-5 mt-5'>
                  {/* <Checkbox
                    checked={isItemSelected(item, index)}
                    onChange={() => handleItemSelect(item, index)}
                    onClick={(e) => e.stopPropagation()} // Prevent double trigger
                    size="small"
                    color="primary"
                  /> */}
                  <span>{item.qty}</span>
                  <span className='pl-2 font-semibold text-blue-800'>{item.FAC_name}</span>
                </div>
                <span className='pl-10 italic text-slate-500'>{item.workDet}</span>
                {item.eval_status && <div className='flex flex-col pl-3 text-black'>
                  <span className='pl-16 mt-1 font-semibold'>{item.eval_status}</span>
                  <span className='pl-16'>Eval. Remarks: {item.eval_remarks}</span>
                </div>}
              </div>
            ))}
            
            {/* Optional: Display selected count */}
            {selectedItems.length > 0 && (
              <div className='px-5 py-3 mt-4 text-sm text-blue-600 rounded-lg bg-blue-50'>
                {selectedItems.length} item(s) selected
              </div>
            )}
          </div>
        </div> 
    
    </>
    )
}

export default MvWorkOrders;