import { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import DateDisplay from '../../Utils/formatDateForInput';
import clsx from 'clsx';
// MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {TextareaAutosize} from '@mui/material';
// Hooks
import {useApprovalLogs} from '../../hooks/useApprovalLogs';
// Custom Utils
import {borderColor} from '../customUtils/filters';



function MvJOForm({
    useProps,
    filteredJO,
    joDetails,
    isLoading,
    error,  
  
  }) {
    const {approvalLogs} = useApprovalLogs(useProps);
    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [openAppOptions, setOpenAppOptions] = useState({});

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

    const handleOpenAppOptions = (JO_No) => {
        setOpenAppOptions(prev => ({
            ...prev,
            [JO_No]: !prev[JO_No]
        }));
        document.body.style.overflow = 'hidden';
    };
  

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

    // Filter joDetails by JO_No & Approval logs by JO_No
    const getItemsByJONo = (JO_No) => {
        return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
    };
    const getAppLogByJONo = (JO_No) => {
        return approvalLogs?.filter(log => log.TRNO === JO_No) || [];
    }

    // Sort the filteredJO array by date (latest first)
    const sortedFilteredJo = useMemo(() => {
        if (!filteredJO) return [];
        
        return [...filteredJO].sort((a, b) => {
            // Sort by JO number in descending order
            // This assumes JO numbers like DB-JO-0000007 (higher number = newer)
            return b.JO_No.localeCompare(a.JO_No);
        });
    }, [filteredJO]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {sortedFilteredJo?.map((header) => {
                const items = getItemsByJONo(header.JO_No);
                const logs = getAppLogByJONo(header.JO_No);

                return (
                    <div key={header?.ID} 
                        className={`flex flex-col w-full gap-1 p-2 border shadow-md rounded-xl ${borderColor(header.xpost, header.DISAPPROVED)}`}
                    >
                      
                        <div className='flex justify-between px-2'>
                            <span className='font-sans text-sm font-semibold text-blue-900'>{header.JO_No}</span>
                            <span className='text-sm text-slate-400'><DateDisplay value={header.xDate} format="short" /></span>
                        </div>

                        {/* Form content */}
                        <div className='flex flex-col px-2'>
                            <div className='flex flex-col'>
                                <div className='flex items-start justify-between text-xs text-slate-500 center'>
                                  <span>{header.Department_Code}</span>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <span className='text-xs text-slate-500'>Remarks:</span>
                                    <span className='text-sm'>{header.Remarks}</span>
                                </div>
                                <span className='font-sans text-xs tracking-wide text-slate-500'>
                                    Requestor: {header.requested_by}
                                </span>
                                <span className='mt-1 text-xs tracking-wide text-slate-500'>For inspection by: {header.Sector_name}</span>
                            </div>
                        </div>

                        {/* Button to View Items and Approvers */}
                        <div className='flex flex-row justify-between px-2 border-t-2'>
                            <div className='flex gap-3'>
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
                                {header.approved_by && <button 
                                  className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-2 border rounded-xl',
                                      !viewApprovers[header.JO_No] ? 'border-slate-400' : 'border-blue-500 text-blue-700'
                                    )}
                                    onClick={() => handleViewApprovers(header.JO_No)}
                                  >
                                    <img className='w-4' src='/icons/actions/approve.png'/>
                                    <span className='font-semibold tracking-wide'>Approvers</span>

                                </button>}
                            </div>
                            {((header.xpost === 3 || header.xpost === 2) && !header.DISAPPROVED) && <button onClick={() => handleOpenAppOptions(header.JO_No)}><MoreHorizIcon /></button>}
                        </div>

                        {/* Items section - dynamically mapped from joDetails */}
                        {viewItems[header.JO_No] && items.length > 0 && (
                            <div className='flex flex-col w-full mt-2 text-sm'>
                                {items.map((item, index) => (
                                    <div key={item.ID || index} className='flex flex-col justify-start mb-3'>
                                        
                                        <div className='flex justify-start w-full gap-3'>

                                            <span className='pl-2'>{item.qty}</span>
                                            <button onClick={() => handleShowItems(item)} className='font-semibold text-blue-600'>
                                                {item.FAC_name}
                                            </button>                
                                            
                                        </div>  
                                        {item.workDet && (
                                            <span className='mt-1 text-xs text-gray-900 pl-7'>
                                                {item.workDet}
                                            </span>
                                        )}
                                        <div className='flex items-center gap-2 mt-1 text-xs pl-7 text-slate-500'>
                                            <span>Target Date:</span>
                                            <span className='pr-2'>{item.TargetDate}</span>               
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
                        {/* Show approval logs */}
                        {viewApprovers[header.JO_No] && logs.length > 0 &&
                            <div className='flex flex-col px-3 mt-2 text-sm'>
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
                    {openAppOptions[header.JO_No] && ReactDOM.createPortal(
                        <div className='fixed flex top-0 bottom-0 left-0 right-0 bg-[hsla(0,0%,20%,0.3)] items-end z-[9999999]'>                            
                            <div className='h-auto animate-slide-up bg-white px-6 py-3 z-[999999] shadow-md relative w-full rounded-md'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='flex justify-between py-2 text-sm font-semibold bg-white'>
                                    <span>{header.JO_No}</span>
                                    <button onClick={() => handleOpenAppOptions(header.JO_No)}> <KeyboardArrowDownIcon /> </button>
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
                                backgroundColor: "hsla(0, 0%, 20%, 0.3)",
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                zIndex: 9999999,
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
                                        <div className="text-gray-400">JO NO:</div>
                                        <div >{selectedDetails.JO_No}</div>
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
                                        <div className="text-sm text-gray-400">Target Date</div>
                                        <div >{selectedDetails.TargetDate}</div>
                                    </div>
                                    {selectedDetails.eval_remarks &&
                                    <>
                                        <div>
                                            <div className="text-sm text-gray-400">Evaluation:</div>
                                            <div >{selectedDetails.eval_status}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Eval. Remarks:</div>
                                            <div >{selectedDetails.eval_remarks}</div>
                                        </div>
                                    </>                                    
                                    }
                                    {selectedDetails.Main_Status &&
                                        <>
                                        <div>
                                            <div className="text-sm text-gray-400">Maintenance Status:</div>
                                            <div >{selectedDetails.Main_Status}</div>
                                        </div>       
                                        </>                                                                       
                                    }
                                    {selectedDetails.Main_Remarks &&
                                        <div>
                                            <div className="text-sm text-gray-400">Maintenance Note:</div>
                                            <div >{selectedDetails.Main_Remarks}</div>
                                        </div>
                                    }
                                    
                                    {selectedDetails.disposal_reason &&
                                        <div>
                                            <div className="text-sm text-gray-400">Disposal Reason:</div>
                                            <div >{selectedDetails.disposal_reason}</div>
                                        </div>
                                    }
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

export default MvJOForm;