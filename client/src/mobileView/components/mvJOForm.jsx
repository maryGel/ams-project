import { useState } from 'react';
import { formatDateForInput } from '../../Utils/formatDateForInput';
import DateDisplay from '../../Utils/formatDateForInput';
import clsx from 'clsx';

// MUI
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';



function MvJOForm({
    joHeaders,
    joDetails,
    isLoading,
    error,  
  
  }) {

    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);


    const handleViewItemsOpen = (JO_No) => {
        setViewItems(prev => ({
            ...prev,
            [JO_No]: !prev[JO_No]
        }));
        setViewApprovers(prev => ({
            ...prev,
            [JO_No]: false
        }));
    };

    const handleViewApprovers = (JO_No) => {
        setViewApprovers(prev => ({
            ...prev,
            [JO_No]: !prev[JO_No]
        }));
        setViewItems(prev => ({
            ...prev,
            [JO_No]: false
        }));
    };

    const handleAppStatus = (xpost, disapproved) => {
    
      if(xpost === 1 && disapproved === 0) return (
        <div className='flex items-center px-1 mx-1'>  
          <DoneAllIcon fontSize='small'className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Fully Approved</span>          
        </div>
      );

      if(xpost === 2 && disapproved === 0) return (
        <div className='flex items-center mx-1'> 
          <DoneIcon fontSize='small' className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Partially Approved</span>          
        </div>
      );

      if(xpost === 0 && disapproved === 0) return (
        <div className='flex items-center mx-1'>     
          <DoneIcon fontSize='small' className='text-slate-400' />
          <span className='text-xs font-semibold tracking-wide text-yellow-600'>Pending</span>          
        </div>
      );
    
      if(xpost === 3 && disapproved === 1) return (
        <div className='flex items-center mx-1'>     
          <CloseIcon fontSize='small' className='text-slate-400' />
          <span className='text-xs font-semibold tracking-wide text-red-600'>Rejected</span>          
        </div>
      );
    }

    const handleShowDetails = (FAC_NO) => {
        const details = joDetails?.find(detail => detail.FAC_NO);
        setSelectedDetails(details);
    };

    const handleCloseDetails = () => {
        setSelectedDetails(null);
    };

    // Filter joDetails by JO_No
    const getItemsByJONo = (JO_No) => {
        return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {joHeaders?.map((header) => {
                const items = getItemsByJONo(header.JO_No);

                
                return (
                    <div key={header.ID} className='flex flex-col w-full gap-1 p-2 border shadow-md border-spacing-2 border-slate-400 rounded-xl'>
                        <div className='flex justify-between p-2'>
                            <div className='flex flex-col'>
                                <span className='text-xs font-semibold'>Job Order</span>
                                <span className='font-sans text-sm font-semibold text-blue-900'>{header.JO_No}</span>
                            </div>
                            <div className='flex items-center'>
                                <span className='border rounded-full border-spacing-1'>
                                    {handleAppStatus(header.xpost, header.DISAPPROVED)}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col p-2'>
                            <div className='flex flex-col text-xs text-slate-500'>
                                <span className='flex justify-end'>
                                    <DateDisplay value={header.xDate} format="short" />
                                </span>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex items-start justify-between pb-1 text-xs text-slate-500 center'>
                                  <span>{header.Department_Code}</span>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <span className='mt-1 text-xs text-slate-500'>Remarks:</span>
                                    <span className='mt-1 text-sm'>{header.Remarks}</span>
                                </div>
                                <span className='mt-3 font-sans text-xs tracking-wide text-slate-500'>
                                    Requestor: {header.requested_by}
                                </span>
                                <span className='mt-1 text-xs tracking-wide text-slate-500'>For inspection by: {header.Sector_name}</span>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between p-2 border-t-2'>
                            <div className='flex gap-3 mt-1 '>
                                <button 
                                    className={clsx(
                                        'flex gap-1 text-xs items-center mt-1 px-2 py-1 border rounded-xl',
                                          !viewItems[header.JO_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                        )}
                                    onClick={() => handleViewItemsOpen(header.JO_No)}
                                >
                                  <img className='w-4' src='/icons/actions/boxes.png'/>
                                  <span className='font-semibold tracking-wide'>Items</span>
                                </button>
                                <button 
                                  className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-2 py-1 border rounded-xl',
                                      !viewApprovers[header.JO_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                    )}
                                    onClick={() => handleViewApprovers(header.JO_No)}
                                  >
                                    <img className='w-4' src='/icons/actions/approve.png'/>
                                    <span className='font-semibold tracking-wide'>Approvers</span>

                                </button>
                            </div>

                        </div>

                        {/* Items section - dynamically mapped from joDetails */}
                        {viewItems[header.JO_No] && items.length > 0 && (
                            <div className='flex flex-col w-full text-sm'>
                                {items.map((item, index) => (
                                    <div key={item.ID || index} className='flex flex-col justify-start mb-3'>
                                        
                                        <div className='flex justify-start w-full gap-3 text-xs '>

                                            <span className='pl-1'>{item.qty}</span>
                                            <button onClick={() => handleShowDetails(item.FAC_NO)} className='font-semibold text-blue-600'>
                                                {item.FAC_name}
                                            </button>                
                                            
                                        </div>  
                                        {item.workDet && (
                                            <span className='pl-5 text-xs text-gray-900'>
                                                {item.workDet}
                                            </span>
                                        )}
                                        <div className='flex items-center gap-2 pl-5 mt-2 text-slate-500'>
                                            <span>Target Date:</span>
                                            <span className='pr-2 font-xs'>{item.TargetDate}</span>               
                                        </div>
                                        <div className='pl-3 mt-2 text-xs '>
                                            <span className='w-45'>{item.Status === 'DONE' ? <DoneIcon fontSize='small'/> : ""}</span> 
                                            <span className='pl-1 font-semibold'>{item.Main_Status}</span>   
                                             
                                            <div className='flex flex-col pl-3 text-slate-500'>
                                                <span>{item.Main_Status === 'DONE' ? item.Main_Remarks : ""}</span>  
                                                <span>{item.Main_Status === 'FOR DISPOSAL' ? item.eval_status : ""}</span>   
                                                <span>{item.Main_Status === 'FOR DISPOSAL' ? item.eval_remarks : ""}</span>  
                                            </div>
                                        </div>
                                       
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Show message if no items */}
                        {viewItems[header.JO_No] && items.length === 0 && (
                            <div className='py-2 text-sm italic text-gray-500'>
                                No items found for this job order.
                            </div>
                        )}

                        {viewApprovers[header.JO_No] && 
                            <div className='flex flex-col p-2 text-sm'>
                                <div className='flex justify-between text-gray-400'>
                                    <span>Approvers</span>
                                    <span>Date Approved</span>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <span className='w-5 text-green-500'>
                                            {header.approved_by ? <CheckCircleIcon fontSize='small' /> : ""}
                                        </span>
                                        <span className='pl-2'>{header.approved_by}</span>
                                    </div>
                                    <span><DateDisplay value={header.xDate} format="short" /></span>
                                </div>
                            </div>
                        }
                    </div>
                );
            })}

        {/* Details Modal */}
        {selectedDetails && (
            <div 
                className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
                onClick={handleCloseDetails}
            >
                {/* Modal container with animation */}
                <div 
                    className="bg-white rounded-t-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto 
                            translate-y-0 animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b">
                        <h2 className="text-lg font-semibold">
                            Item Details - {selectedDetails.FAC_NO}
                        </h2>
                        <button 
                            onClick={handleCloseDetails}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedDetails).map(([key, value]) => {
                                if (value === null || value === '' || value === undefined) return null;
                                
                                const formattedKey = key
                                    .replace(/_/g, ' ')
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                                
                                return (
                                    <div key={key} className="pb-2 border-b">
                                        <div className="text-xs text-gray-500">{formattedKey}</div>
                                        <div className="text-sm font-medium break-words">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default MvJOForm;