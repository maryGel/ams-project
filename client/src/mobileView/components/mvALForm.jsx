import { useState, useMemo } from 'react';
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


function MvALForm({
    useProps,
    filteredAL,
    assetLostDetails,

  }) {
    const {approvalLogs} = useApprovalLogs(useProps);
    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [openAppOptions, setOpenAppOptions] = useState({});

    const handleViewItemsOpen = (AAFNo) => {
        setViewItems(prev => ({
            ...prev,
            [AAFNo]: !prev[AAFNo]
        }));
        setViewApprovers(prev => ({
            ...prev,
            [AAFNo]: false
        }));
    };

    const handleViewApprovers = (AAFNo) => {
        setViewApprovers(prev => ({
            ...prev,
            [AAFNo]: !prev[AAFNo]
        }));
        setViewItems(prev => ({
            ...prev,
            [AAFNo]: false
        }));
    };

    const handleOpenAppOptions = (AAFNo) => {
        setOpenAppOptions(prev => ({
            ...prev,
            [AAFNo]: !prev[AAFNo]
        }));
        document.body.style.overflow = 'hidden';
    };

    const handleAppStatus = (xPosted, disapproved) => {
    
      if(xPosted === 1 && !disapproved) return (
        <div className='flex items-center px-1 mx-1'>  
          <DoneAllIcon fontSize='small'className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Fully Approved</span>          
        </div>
      );

      if(xPosted === 2 && !disapproved) return (
        <div className='flex items-center mx-1'> 
          <DoneIcon fontSize='small' className='text-green-500'/>
          <span className='text-xs font-semibold tracking-wide'>Partially Approved</span>          
        </div>
      );

      if(xPosted === 3  && !disapproved) return (
        <div className='flex items-center mx-1'>     
          <DoneIcon fontSize='small' className='text-slate-400' />
          <span className='text-xs font-semibold tracking-wide text-yellow-600'>Pending</span>          
        </div>
      );
    
      if(xPosted === 3 && disapproved === 1) return (
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

    // Filter joDetails by AAFNo & Approval logs by AAFNo
    const getItemsByAANo = (AAFNo) => {
        return assetLostDetails?.filter(detail => detail.AAFNo === AAFNo) || [];
    };
    const getAppLogByAANo = (AAFNo) => {
        return approvalLogs?.filter(log => (log.TRNO === AAFNo) && log.Module === 'Lost Asset') || [];
    }

    // Sort the filteredJo array by date (latest first)
    const sortedFilteredAL= useMemo(() => {
        if (!filteredAL) return [];
        
        return [...filteredAL].sort((a, b) => {
            // Sort by JO number in descending order
            // This assumes JO numbers like DB-JO-0000007 (higher number = newer)
            return b.AAFNo.localeCompare(a.AAFNo);
        });
    }, [filteredAL]);

    return (
        <>
            {sortedFilteredAL?.map((header) => {
                const items = getItemsByAANo(header.AAFNo);
                const logs = getAppLogByAANo(header.AAFNo);
                

                return (
                    <div key={header.ID} className='flex flex-col w-full gap-1 p-2 border shadow-md border-spacing-2 border-slate-400 rounded-xl'>
                        <div className='flex justify-between px-2'>
                            <div className='flex flex-col'>
                                <span className='text-xs font-semibold'>Lost Asset Form</span>
                                <span className='font-sans text-sm font-semibold text-blue-900'>{header.AAFNo}</span>
                            </div>
                            <div className='flex items-center'>
                                <span className='border rounded-full border-spacing-1'>
                                    {handleAppStatus(header.xPosted, header.DISAPPROVED)}
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
                                  <span>{header.Dep}</span>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <span className='text-xs text-slate-500'>Custodian:</span>
                                    <span className='text-sm'>{header.Custodian}</span>
                                </div>
                                {/* <span className='font-sans text-xs tracking-wide text-slate-500'>
                                    Holder: {header.Holder}
                                </span> */}
                                <span className='mt-1 text-xs tracking-wide text-slate-500'>Assigned to: {header.EmpName}</span>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between px-2 border-t-2'>
                            <div className='flex gap-3'>
                                <button 
                                    className={clsx(
                                        'flex gap-1 text-xs items-center mt-1 px-2 py-1 border rounded-xl',
                                          !viewItems[header.AAFNo] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                        )}
                                    onClick={() => handleViewItemsOpen(header.AAFNo)}
                                >
                                  <img className='w-4' src='/icons/actions/boxes.png'/>
                                  <span className='font-semibold tracking-wide'>Items</span>
                                </button>
                                {header.appStat && <button 
                                  className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-2 border rounded-xl',
                                      !viewApprovers[header.AAFNo] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                    )}
                                    onClick={() => handleViewApprovers(header.AAFNo)}
                                  >
                                    <img className='w-4' src='/icons/actions/approve.png'/>
                                    <span className='font-semibold tracking-wide'>Approvers</span>

                                </button>}
                            </div>
                            {((header.xPosted === 3 || header.xPosted === 2) && !header.DISAPPROVED) && <button onClick={() => handleOpenAppOptions(header.AAFNo)}><MoreHorizIcon /></button>}
                        </div>

                        {/* Items section - dynamically mapped from joDetails */}
                        {viewItems[header.AAFNo] && items.length > 0 && (
                            <div className='flex flex-col w-full mt-3 text-sm'>
                                {items.map((item, index) => (
                                    <div key={item.ID || index} className='flex flex-col justify-start mb-3'>
                                        
                                        <div className='flex justify-start w-full gap-3 text-xs '>

                                            <span className='pl-2'>{item.Qty}</span>
                                            <button onClick={() => handleShowItems(item)} className='font-semibold text-blue-600'>
                                                {item.ItemName}
                                            </button>                
                                            
                                        </div>  
                                        {item.xStat && (
                                            <div className='flex items-center gap-2 p-1 ml-6 text-xs'>
                                                <span >Status:</span>
                                                <span className='text-xs text-gray-900'>
                                                    {item.xStat}
                                                </span>
                                            </div>
                                        )}
                                        {/* <div className='flex items-center gap-2 mt-1 text-xs pl-7 text-slate-500'>
                                            <span className='pr-2'>{item.ItemNo}</span>               
                                        </div>                                       */}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Show message if no items */}
                        {viewItems[header.AAFNo] && items.length === 0 && (
                            <div className='py-2 text-sm italic text-gray-500'>
                                No items found for this job order.
                            </div>
                        )}
                        {/* Show approval logs */}
                        {viewApprovers[header.AAFNo] && logs.length > 0 &&
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
                    
                    {openAppOptions[header.AAFNo] && ReactDOM.createPortal(
                         <div className='fixed flex top-0 bottom-0 left-0 right-0 bg-[hsla(0,0%,20%,0.3)] items-end z-[9999999]'>                            
                            <div className='h-auto animate-slide-up bg-white px-6 py-3 z-[999999] shadow-md relative w-full rounded-md'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='flex justify-between py-2 text-sm font-semibold bg-white'>
                                    <span>{header.AAFNo}</span>
                                    <button onClick={() => handleOpenAppOptions(header.AAFNo)}> <KeyboardArrowDownIcon /> </button>
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
                                        Asset : {selectedDetails.ItemName}
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
                                    <div >{selectedDetails.ItemNo}</div>
                                </div>
                                
                                {/* Quantity and Target Date */}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    
                                     <div>
                                        <div className="text-gray-400">TR NO:</div>
                                        <div >{selectedDetails.AAFNo}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 ">Quantity</div>
                                        <div >{selectedDetails.Qty}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 ">UOM</div>
                                        <div >{selectedDetails.Units}</div>
                                    </div>                                   
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

export default MvALForm;