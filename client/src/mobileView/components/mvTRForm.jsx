import { useState, useMemo} from 'react';
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
import {TextareaAutosize} from '@mui/material';
// Hooks
import {useApprovalLogs} from '../../hooks/useApprovalLogs';


function MvTRForm({
    useProps,
    filteredTR,
    trDetails,

  }) {
    const {approvalLogs} = useApprovalLogs(useProps);
    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [openAppOptions, setOpenAppOptions] = useState({});

    const handleViewItemsOpen = (TR_No) => {
        setViewItems(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        setViewApprovers(prev => ({
            ...prev,
            [TR_No]: false
        }));
    };

    const handleViewApprovers = (TR_No) => {
        setViewApprovers(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        setViewItems(prev => ({
            ...prev,
            [TR_No]: false
        }));
    };


    const handleOpenAppOptions = (TR_No) => {
        setOpenAppOptions(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        document.body.style.overflow = 'hidden';
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

    // Filter joDetails by TR_No & Approval logs by TR_No
    const getItemsByTRNo = (TR_No) => {
        return trDetails?.filter(detail => detail.TR_No === TR_No) || [];
    };
    const getAppLogByTRNo = (TR_No) => {
        return approvalLogs?.filter(log => (log.TRNO === TR_No) && log.Module === 'Transfer (Internal)') || [];
    }


    // Sort the filteredTR array by date (latest first)
    const sortedFilteredTR = useMemo(() => {
        if (!filteredTR) return [];
        
        return [...filteredTR].sort((a, b) => {
            // Sort by JO number in descending order
            // This assumes JO numbers like DB-JO-0000007 (higher number = newer)
            return b.TR_No.localeCompare(a.TR_No);
        });
    }, [filteredTR]);


    return (
        <>
            {sortedFilteredTR?.map((header) => {
                const items = getItemsByTRNo(header.TR_No);
                const logs = getAppLogByTRNo(header.TR_No);
                

                return (
                    <div key={header.ID} className='flex flex-col w-full gap-1 p-2 border shadow-md border-spacing-2 border-slate-400 rounded-xl'>
                        <div className='flex justify-between px-2'>
                            <div className='flex flex-col'>
                                <span className='text-xs font-semibold'>Transfer - Internal</span>
                                <span className='font-sans text-sm font-semibold text-blue-900'>{header.TR_No}</span>
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
                                  <span>{header.Department}</span>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <span className='text-xs text-slate-500'>Remarks:</span>
                                    <span className='text-sm'>{header.Remarks}</span>
                                </div>
                                <span className='font-sans text-xs tracking-wide text-slate-500'>
                                    Holder: {header.Holder}
                                </span>
                                <span className='mt-1 text-xs tracking-wide text-slate-500'>For Transfer to: {header.Location}</span>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between px-2 border-t-2'>
                            <div className='flex gap-3'>
                                <button 
                                    className={clsx(
                                        'flex gap-1 text-xs items-center mt-1 px-2 py-1 border rounded-xl',
                                          !viewItems[header.TR_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                        )}
                                    onClick={() => handleViewItemsOpen(header.TR_No)}
                                >
                                  <img className='w-4' src='/icons/actions/boxes.png'/>
                                  <span className='font-semibold tracking-wide'>Items</span>
                                </button>
                                {header.appStat && <button 
                                  className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-2 border rounded-xl',
                                      !viewApprovers[header.TR_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                    )}
                                    onClick={() => handleViewApprovers(header.TR_No)}
                                  >
                                    <img className='w-4' src='/icons/actions/approve.png'/>
                                    <span className='font-semibold tracking-wide'>Approvers</span>

                                </button>}
                            </div>
                            {((header.xpost === 3 || header.xpost === 2) && !header.DISAPPROVED) && <button  onClick={() => handleOpenAppOptions(header.TR_No)} ><MoreHorizIcon /></button>}
                        </div>

                        {/* Items section - dynamically mapped from joDetails */}
                        {viewItems[header.TR_No] && items.length > 0 && (
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
                                        <div className='flex items-center gap-2 mt-1 text-xs pl-7 text-slate-500'>
                                            <span className='pr-2'>{item.FAC_NO}</span>               
                                        </div>                                      
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Show message if no items */}
                        {viewItems[header.TR_No] && items.length === 0 && (
                            <div className='py-2 text-sm italic text-gray-500'>
                                No items found for this job order.
                            </div>
                        )}
                        {/* Show approval logs */}
                        {viewApprovers[header.TR_No] && logs.length > 0 &&
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

                    
                    
                    {openAppOptions[header.TR_No] && ReactDOM.createPortal(
                         <div className='fixed flex top-0 bottom-0 left-0 right-0 bg-[hsla(0,0%,20%,0.3)] items-end z-[9999999]'>                            
                            <div className='h-auto animate-slide-up bg-white px-6 py-3 z-[999999] shadow-md relative w-full rounded-md'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='flex justify-between py-2 text-sm font-semibold bg-white'>
                                    <span>{header.TR_No}</span>
                                    <button onClick={() => handleOpenAppOptions(header.TR_No)}> <KeyboardArrowDownIcon /> </button>
                                </div>
                                <div className='w-full text-sm'>
                                    <span className='text-slate-600'>Remarks</span>
                                    <TextareaAutosize
                                        minRows={2}
                                        label = {'Remarks'}
                                        style={{ 
                                            width: '100%',
                                            resize: 'both',
                                            color: 'black',
                                            padding: '.5rem',
                                            border: '1px solid #ccc',
                                            marginTop: '.5rem'
                                        }}        
                                    />
                                    <button className='w-full py-2 mt-2 tracking-wide text-white bg-green-600 shadow-md rounded-2xl hover:bg-green-800'>A p p r o v e</button>
                                    <button className='w-full py-2 my-2 font-sans tracking-wide text-red-500 border border-red-600 rounded-2xl hover:bg-red-600 hover:text-white'>R e j e c t</button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}


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
                                        <div >{selectedDetails.TR_No}</div>
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
                                        <div className="text-gray-400 ">New Holder</div>
                                        <div >{selectedDetails.New_Holder}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Acquired Date</div>
                                        <DateDisplay value={selectedDetails.Date_Aq} format="short" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Acquired Value</div>
                                        <div >{selectedDetails.Amount_aq} </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Transfer from:</div>
                                        <div >{selectedDetails.Orig_Department}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Transfer to:</div>
                                        <div >{selectedDetails.New_Location}</div>
                                    </div>
                                    {selectedDetails.Brand &&
                                        <div>
                                            <div className="text-sm text-gray-400">Brand:</div>
                                            <div >{selectedDetails.brand}</div>
                                        </div>
                                    }
                                    {selectedDetails.serial_no &&
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

export default MvTRForm;