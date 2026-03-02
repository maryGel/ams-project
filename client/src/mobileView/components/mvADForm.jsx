import { useState } from 'react';
import ReactDOM from 'react-dom';
import DateDisplay from '../../Utils/formatDateForInput';
import clsx from 'clsx';

// MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// Hooks
import {useApprovalLogs} from '../../hooks/useApprovalLogs';


function MvADForm({
    useProps,
    filteredAD,
    adDetails,

  }) {
    const {approvalLogs} = useApprovalLogs(useProps);
    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);

    const handleViewItemsOpen = (AD_No) => {
        setViewItems(prev => ({
            ...prev,
            [AD_No]: !prev[AD_No]
        }));
        setViewApprovers(prev => ({
            ...prev,
            [AD_No]: false
        }));
    };

    const handleViewApprovers = (AD_No) => {
        setViewApprovers(prev => ({
            ...prev,
            [AD_No]: !prev[AD_No]
        }));
        setViewItems(prev => ({
            ...prev,
            [AD_No]: false
        }));
    };

    const handleAppStatus = (xpost, disapproved) => {
    
      if(xpost === 1 && !disapproved) return (
        <div className='flex items-center px-1 mx-1'>  
          <DoneAllIcon fontSize='small'className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Fully Approved</span>          
        </div>
      );

      if(xpost === 2 && !disapproved) return (
        <div className='flex items-center mx-1'> 
          <DoneIcon fontSize='small' className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Partially Approved</span>          
        </div>
      );

      if(xpost === 3  && !disapproved) return (
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

    const handleShowItems = (item) => {
        setSelectedDetails(item)
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    };


    const handleCloseDetails = () => {
        setSelectedDetails(null);
         // Restore background scrolling
        document.body.style.overflow = 'unset';
    };

    // Filter joDetails by AD_No & Approval logs by AD_No
    const getItemsByADNo = (AD_No) => {
        return adDetails?.filter(detail => detail.AD_No === AD_No) || [];
    };
    const getAppLogByADNo = (AD_No) => {
        return approvalLogs?.filter(log => (log.TRNO === AD_No) && log.Module === 'Disposal') || [];
    }

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    return (
        <>
            {filteredAD?.map((header) => {
                const items = getItemsByADNo(header.AD_No);
                const logs = getAppLogByADNo(header.AD_No);
                

                return (
                    <div key={header.ID} className='flex flex-col w-full gap-1 p-2 border shadow-md border-spacing-2 border-slate-400 rounded-xl'>
                        <div className='flex justify-between px-2'>
                            <div className='flex flex-col'>
                                <span className='text-xs font-semibold'>Disposal</span>
                                <span className='font-sans text-sm font-semibold text-blue-900'>{header.AD_No}</span>
                            </div>
                            <div className='flex items-center'>
                                <span className='border rounded-full border-spacing-1'>
                                    {handleAppStatus(header.xpost, header.DISAPPROVED)}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col px-2'>
                            <div className='flex flex-col text-xs text-slate-500'>
                                <span className='flex justify-end'>
                                    <DateDisplay value={header.xDate} format="short" />
                                </span>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex items-start justify-between text-xs text-slate-500 center'>
                                  <span>{header.Deparment_Name}</span>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <span className='text-xs text-slate-500'>Remarks:</span>
                                    <span className='text-sm'>{header.Remarks}</span>
                                </div>
                                {/* <span className='font-sans text-xs tracking-wide text-slate-500'>
                                    Holder: {header.Holder}
                                </span> */}
                                <span className='mt-1 text-xs tracking-wide text-slate-500'>Evaluated By: {header.Evaluated_By}</span>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between px-2 border-t-2'>
                            <div className='flex gap-3'>
                                <button 
                                    className={clsx(
                                        'flex gap-1 text-xs items-center mt-1 px-2 py-1 border rounded-xl',
                                          !viewItems[header.AD_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                        )}
                                    onClick={() => handleViewItemsOpen(header.AD_No)}
                                >
                                  <img className='w-4' src='/icons/actions/boxes.png'/>
                                  <span className='font-semibold tracking-wide'>Items</span>
                                </button>
                                {header.approved_by && <button 
                                  className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-2 border rounded-xl',
                                      !viewApprovers[header.AD_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                    )}
                                    onClick={() => handleViewApprovers(header.AD_No)}
                                  >
                                    <img className='w-4' src='/icons/actions/approve.png'/>
                                    <span className='font-semibold tracking-wide'>Approvers</span>

                                </button>}
                            </div>
                            {((header.xpost === 3 || header.xpost === 2) && !header.DISAPPROVED) && <button><MoreHorizIcon /></button>}
                        </div>

                        {/* Items section - dynamically mapped from joDetails */}
                        {viewItems[header.AD_No] && items.length > 0 && (
                            <div className='flex flex-col w-full mt-3 text-sm'>
                                {items.map((item, index) => (
                                    <div key={item.ID || index} className='flex flex-col justify-start mb-3'>
                                        
                                        <div className='flex justify-start w-full gap-3 text-xs '>

                                            <span className='pl-2'>{item.qty}</span>
                                            <button onClick={() => handleShowItems(item)} className='font-semibold text-blue-600'>
                                                {item.FAC_name}
                                            </button>                
                                            
                                        </div>  
                                        {item.workDet && (
                                            <span className='text-xs text-gray-900 pl-7'>
                                                {item.workDet}
                                            </span>
                                        )}
                                        {/* <div className='flex items-center gap-2 mt-1 text-xs pl-7 text-slate-500'>
                                            <span className='pr-2'>{item.FAC_NO}</span>               
                                        </div>                                       */}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Show message if no items */}
                        {viewItems[header.AD_No] && items.length === 0 && (
                            <div className='py-2 text-sm italic text-gray-500'>
                                No items found for this job order.
                            </div>
                        )}
                        {/* Show approval logs */}
                        {viewApprovers[header.AD_No] && logs.length > 0 &&
                            <div className='flex flex-col px-3 mt-2 text-sm'>
                                <div className='flex justify-between tracking-wide text-gray-500'>
                                    <span>Approvers</span>
                                    <span className='mr-3'>Date</span>
                                </div>
                                
                                {logs.map((log) => (<>

                                <div className='flex items-center justify-between mt-2'>
                                    <div className='flex items-center gap-1'>
                                        <span className='w-5 text-green-500'>
                                            {log.TRNO && log.STAT !== 'Disapproved' ? <CheckCircleIcon fontSize='small' /> : <CancelIcon fontSize='small' className='text-red-500'/>}
                                        </span>
                                        <span>{log.X_USER?.split('-')[1]}</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <span>{log.STAT === 'Disapproved' ? "" : log.STAT}</span>
                                        <span><DateDisplay value={log.DT} format="short" /></span>    
                                    </div>                                    
                                </div>
                                <span className='pt-1 pl-6 text-slate-500'>{log.REMARKS}</span>
                                </>))}
                            </div>
                        }


                    {/* Display the Asset information and its status */}
                    {selectedDetails && ReactDOM.createPortal(
                        <div 
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                // Use RGBA with high specificity
                                // color: 'white',
                                backgroundColor: "hsla(0, 0%, 20%, 0.3)",
                                // Fallback using a semi-transparent PNG data URI (most aggressive approach)
                                // backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=) !important',
                                // backgroundRepeat: 'repeat !important',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                zIndex: 9999999,
                                // opacity: 0.5
                            }}
                            onClick={handleCloseDetails}
                        >
                            <div className='animate-slide-up'
                                style={{
                                    backgroundColor: 'whitesmoke',
                                    width: '100%',
                                    maxWidth: '600px',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    borderTopLeftRadius: '0.5rem',
                                    borderTopRightRadius: '0.5rem',
                                    padding: '1rem',
                                    position: 'relative',
                                    zIndex: 99999999,
                                    boxShadow: '0 -2px 3px -1px rgba(0, 0, 0, 0.1)',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-sm font-semibold ">
                                        Asset : {selectedDetails.FAC_name}
                                    </h2>
                                    <button 
                                        onClick={handleCloseDetails}
                                        className="text-base hover:text-gray-600"
                                    >
                                    <KeyboardArrowDownIcon  />
                                    </button>
                                </div>
                                <div className='flex gap-2 py-1 mb-3 text-sm border-b '>
                                    <div className="text-gray-500">Asset No:</div>
                                    <div >{selectedDetails.FAC_NO}</div>
                                </div>
                                
                                {/* Quantity and Target Date */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    
                                     <div>
                                        <div className="text-gray-400">TR NO:</div>
                                        <div >{selectedDetails.AD_No}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 ">Quantity</div>
                                        <div >{selectedDetails.qty}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 ">UOM</div>
                                        <div >{selectedDetails.UOM}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 ">Disposal Type</div>
                                        <div >{selectedDetails.Disposal_Type}</div>
                                    </div>

                                    {selectedDetails.brand &&
                                        <div>
                                            <div className="text-sm text-gray-400">Brand:</div>
                                            <div >{selectedDetails.brand}</div>
                                        </div>
                                    }
                                    {selectedDetails.serialno &&
                                    <>
                                        <div>
                                            <div className="text-sm text-gray-400">Serial No:</div>
                                            <div >{selectedDetails.serialno}</div>
                                        </div>
                                    </>
                                    }
                                   
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                    </div>
                    
                );
    
            })}

        </>
    );
}

export default MvADForm;