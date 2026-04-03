import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import DateDisplay from '../../Utils/formatDateForInput';
import clsx from 'clsx';
// MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextareaAutosize, CircularProgress } from '@mui/material';

// Hooks
import { useJobOrderApproval } from '../../hooks/useJobOrderApproval';
import {useApprovalLogs} from '../../hooks/useApprovalLogs';
// Custom Utils
import { borderColor } from '../customUtils/filters';

function MvJOForm({
  useProps,
  filteredJO,
  joDetails,
  isLoading,
  error,
  selectedUser,
  joRefresh, 
  joDetailsRefresh,
  selectionMode,
  selectedJO,
  setSelectedJO,
  onEnterSelectionMode,
  onExitSelectionMode,
  onSelectAll, 
  selectAll 
}) {
  const { 
    approveJobOrder, 
    rejectJobOrder, 
    loading: approvalLoading 
  } = useJobOrderApproval();
  
  const {approvalLogs} = useApprovalLogs(useProps);
  const [viewItems, setViewItems] = useState({});
  const [viewApprovers, setViewApprovers] = useState({});
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [openAppOptions, setOpenAppOptions] = useState({});
  const [remarks, setRemarks] = useState({});
  const [processingJO, setProcessingJO] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Bulk approval state
  const [bulkApprovalDialogOpen, setBulkApprovalDialogOpen] = useState(false);
  const [bulkApprovalRemarks, setBulkApprovalRemarks] = useState('');
  const [bulkApprovalLoading, setBulkApprovalLoading] = useState(false);
  
  const toastTimeoutRef = useRef(null);
  
  // Show toast with longer duration (5s) and pause on hover
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });

    // Clear previous timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  // Handle bulk approval
  const handleBulkApprove = async () => {
    if (selectedJO.length === 0) {
      showToast('No job orders selected', 'error');
      return;
    }

    if (!bulkApprovalRemarks.trim()) {
      showToast('Please provide remarks for bulk approval', 'error');
      return;
    }

    setBulkApprovalLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Process each selected JO
      for (const joNo of selectedJO) {
        const result = await approveJobOrder(joNo, bulkApprovalRemarks, selectedUser);
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to approve JO ${joNo}:`, result.error);
        }
      }

      // Show results
      if (successCount > 0) {
        showToast(
          `Approved ${successCount} job order${successCount > 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`,
          failCount === 0 ? 'success' : 'warning'
        );
        
        // Close dialog
        setBulkApprovalDialogOpen(false);
        setBulkApprovalRemarks('');
        
        // Clear selection and exit selection mode
        setSelectedJO([]);
        if (onExitSelectionMode) onExitSelectionMode();
        
        // Refresh data
        setTimeout(() => {
          joRefresh?.();
          joDetailsRefresh?.();
        }, 2000);
      } else {
        showToast(`Failed to approve all ${failCount} job orders`, 'error');
      }
    } catch (error) {
      console.error('Bulk approval error:', error);
      showToast('Failed to process bulk approval', 'error');
    } finally {
      setBulkApprovalLoading(false);
    }
  };

  // Open bulk approval dialog
  const handleOpenBulkApproval = () => {
    if (selectedJO.length === 0) {
      showToast('No job orders selected', 'error');
      return;
    }
    setBulkApprovalDialogOpen(true);
  };

  // Close bulk approval dialog
  const handleCloseBulkApproval = () => {
    if (!bulkApprovalLoading) {
      setBulkApprovalDialogOpen(false);
      setBulkApprovalRemarks('');
    }
  };

  const handleViewItemsOpen = (e, JO_No) => {
    e.stopPropagation();
    setViewItems(prev => ({
      ...prev,
      [JO_No]: !prev[JO_No]
    }));
    setViewApprovers(prev => ({
      ...prev,
      [JO_No]: false
    }));
  };
  
  const handleViewApprovers = (e, JO_No) => {
    e.stopPropagation();
    setViewApprovers(prev => ({
      ...prev,
      [JO_No]: !prev[JO_No]
    }));
    setViewItems(prev => ({
      ...prev,
      [JO_No]: false
    }));
  };
  
  const handleOpenAppOptions = (e, JO_No) => {
    e.stopPropagation();
    setOpenAppOptions(prev => ({
      ...prev,
      [JO_No]: !prev[JO_No]
    }));
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseAppOptions = (JO_No) => {
    setOpenAppOptions(prev => ({
      ...prev,
      [JO_No]: false
    }));
    document.body.style.overflow = 'unset';
    // Clear remarks for this JO
    setRemarks(prev => ({
      ...prev,
      [JO_No]: ''
    }));
    setProcessingJO(null);
  };
  
  const handleShowItems = (item) => {
    setSelectedDetails(item);
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseDetails = () => {
    setSelectedDetails(null);
    document.body.style.overflow = 'unset';
  };
  
  const handleRemarksChange = (JO_No, value) => {
    setRemarks(prev => ({
      ...prev,
      [JO_No]: value
    }));
  };

  const longPressTimeout = useRef(null);
  // Called on mousedown / touchstart
  const handleLongPressStart = (header) => {
    // Only allow long press for Waiting status JOs (xpost === 3 and not disapproved)
    if (header.xpost === 3 && !header.DISAPPROVED) {
      longPressTimeout.current = setTimeout(() => {
        if (onEnterSelectionMode) onEnterSelectionMode(header.JO_No);
      }, 500); // 500ms long press
    }
  };

  // Clear timeout if released too early
  const handleLongPressEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  // . . . .  Approval Flow . . . . 
  const handleApprove = async (JO_No) => {
    const remarkText = remarks[JO_No] || '';
    
    if (!remarkText.trim()) {
      showToast('Please provide remarks for approval', 'error');
      return;
    }
    
    setProcessingJO(JO_No);
    
    const result = await approveJobOrder(JO_No, remarkText, selectedUser);
    
    if (result.success) {
      showToast(result.message, 'success');
      handleCloseAppOptions(JO_No);
      
      // Trigger refresh in parent component
      setTimeout(() => {
        joRefresh?.();
        joDetailsRefresh?.();
      }, 2000);
      
      setProcessingJO(null);
    } else {
      if (result.requiredAppCode) {
        showToast(`Access denied. Required: ${result.requiredAppCode}`, 'error');
      } else {
        showToast(`Error: ${result.error}`, 'error');
      }
      setProcessingJO(null);
    }
  };

  
  const handleReject = async (JO_No) => {
    const remarkText = remarks[JO_No] || '';
    
    if (!remarkText.trim()) {
      showToast('Please provide remarks for rejection', 'error');
      return;
    }
    
    setProcessingJO(JO_No);
    
    const result = await rejectJobOrder(JO_No, remarkText, selectedUser);
    
    if (result.success) {
      showToast('Job Order rejected successfully', 'success');
      handleCloseAppOptions(JO_No);
      
      // Trigger refresh in parent component
      if (joRefresh) {
        joRefresh?.();
        joDetailsRefresh?.()
      }
      
      setProcessingJO(null);
    } else {
      showToast(`Error: ${result.error}`, 'error');
      setProcessingJO(null);
    }
  };
  
  // Filter joDetails by JO_No & Approval logs by JO_No
  const getItemsByJONo = (JO_No) => {
    return joDetails?.filter(detail => detail.JO_No === JO_No) || [];
  };
  
  // Get approval logs from the status object
  const getApprovalLogs = (JO_No) => {
    return approvalLogs?.filter(log => log.TRNO === JO_No) || [];
  }
  
  // Sort the filteredJO array by date (latest first)
  const sortedFilteredJo = useMemo(() => {
    if (!filteredJO) return [];
    return [...filteredJO].sort((a, b) => b.JO_No.localeCompare(a.JO_No));
  }, [filteredJO]);
  
  // Show loading state while refreshing
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-8">
      <CircularProgress />
      <span className="mt-3 text-sm text-gray-500">Loading job orders...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-4 text-center text-red-600 rounded-lg bg-red-50">
      Error: {error}
    </div>
  );
  
  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-[10000000] px-4 text-sm py-2 shadow-lg animate-slide-in-right ${
          toast.type === 'success' ? 'bg-green-200 text-green-700' : 
          toast.type === 'warning' ? 'bg-yellow-200 text-yellow-700' : 
          'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      {/* Bulk Approval Dialog */}
      {bulkApprovalDialogOpen && ReactDOM.createPortal(
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-end z-[99999] animate-fade-in'>
          <div 
            className='w-full bg-white shadow-xl rounded-t-2xl animate-slide-up'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='sticky top-0 px-6 py-4 bg-white border-b rounded-t-2xl'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Bulk Approval</h3>
                  <p className='text-sm text-gray-500'>
                    You are about to approve {selectedJO.length} job order{selectedJO.length > 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  onClick={handleCloseBulkApproval}
                  className="p-1 transition-colors rounded-full hover:bg-gray-100"
                  disabled={bulkApprovalLoading}
                >
                  <KeyboardArrowDownIcon />
                </button>
              </div>
            </div>
            
            <div className='p-6'>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-700'>
                  Remarks <span className="text-red-500">*</span>
                </label>
                <TextareaAutosize
                  minRows={3}
                  placeholder="Please enter your approval remarks for all selected job orders..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={bulkApprovalRemarks}
                  onChange={(e) => setBulkApprovalRemarks(e.target.value)}
                  disabled={bulkApprovalLoading}
                  autoFocus
                />
              </div>
              
              <div className='flex flex-col gap-3'>
                <button 
                  className='flex-1 py-3 tracking-wide text-white transition-colors bg-green-600 rounded-full shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleBulkApprove}
                  disabled={bulkApprovalLoading || !bulkApprovalRemarks.trim()}
                >
                  {bulkApprovalLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircularProgress size={20} color="inherit" />
                      <span>Processing {selectedJO.length} JO{selectedJO.length > 1 ? 's' : ''}...</span>
                    </div>
                  ) : (
                    `Approve All (${selectedJO.length})`
                  )}
                </button>
                <button 
                  className='flex-1 py-3 tracking-wide text-gray-600 transition-colors border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleCloseBulkApproval}
                  disabled={bulkApprovalLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Selection Mode Header */}
      {selectionMode && selectedJO.length > 0 && (
        <div className="sticky top-0 z-10 flex items-center justify-between p-3 text-xs border-b border-blue-200 bg-blue-50">
           <span className="font-medium text-blue-700">
              {selectedJO.length} job order{selectedJO.length > 1 ? 's' : ''} selected
            </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenBulkApproval}
              className="px-4 py-1 text-xs text-white whitespace-normal transition-colors bg-green-600 rounded-md hover:bg-green-700"
            >
              Approve <br /> Selected
            </button>
            <button
              onClick={() => {
                if (onSelectAll) onSelectAll();
              }}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      )}
      
      {sortedFilteredJo?.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No job orders found
        </div>
      ) : (
        sortedFilteredJo.map((header) => {
          const items = getItemsByJONo(header.JO_No);
          const logs = getApprovalLogs(header.JO_No);
          
          return (
            <div 
              key={header?.ID} 
              className={clsx(
                "flex flex-col mx-3 gap-1 p-2  border rounded-xl",
                borderColor(header.xpost, header.DISAPPROVED),
                (selectedJO.includes(header.JO_No) && header.xpost === 3 && !header.DISAPPROVED) && "bg-slate-200 border-blue-500",
                !(header.xpost === 3 && !header.DISAPPROVED) && "cursor-not-allowed opacity-75"
              )}
              onClick={() => {
                // Only allow selection for Waiting status JOs
                if (selectionMode && header.xpost === 3 && !header.DISAPPROVED) {
                  if (selectedJO.includes(header.JO_No)) {
                    setSelectedJO(prev => prev.filter(j => j !== header.JO_No));
                  } else {
                    setSelectedJO(prev => [...prev, header.JO_No]);
                  }
                }
              }}
              onTouchStart={() => handleLongPressStart(header)}
              onTouchEnd={handleLongPressEnd}
            >
              {/* Form content - keep your existing JSX here */}
              <div className='flex items-center justify-between px-2 text-sm'>
                <span className='font-sans text-sm font-semibold text-blue-900'>{header.JO_No}</span>
                <DateDisplay value={header.xDate} format="short" />
              </div>
              
              <div className='flex flex-col px-2'>
                <div className='flex flex-col gap-1 text-sm text-slate-600'>
                    <span>{header.Department_Code}</span>
                    <span>Requestor: {header.requested_by}</span>
                    <span>For inspection by: {header.Sector_name}</span>
                    <span className='text-sm'>Remarks: {header.Remarks}</span>
                </div>
              </div>
              
              {/* Button to View Items and Approvers */}
              <div className='flex flex-row justify-between px-2 border-t-2'>
                <div className='flex gap-3'>
                  <button 
                    className={clsx(
                      'flex gap-1 text-xs items-center mt-1 px-3 py-1 border rounded-full transition-all duration-200',
                      !viewItems[header.JO_No] ? 'border-slate-400 hover:border-blue-500' : 'border-blue-500 text-blue-700 bg-blue-50'
                    )}
                    onClick={(e) => handleViewItemsOpen(e, header.JO_No)}
                  >
                    <img className='w-4' src='/icons/actions/boxes.png' alt="items"/>
                    <span className='font-semibold tracking-wide'>Items ({items.length})</span>
                  </button>
                  {(header.approved_by || logs.length > 0) && (
                    <button 
                      className={clsx(
                        'flex gap-1 text-xs items-center mt-1 px-2 border rounded-full transition-all duration-200',
                        !viewApprovers[header.JO_No] ? 'border-slate-400 hover:border-blue-500' : 'border-blue-500 text-blue-700 bg-blue-50'
                      )}
                      onClick={(e) => handleViewApprovers(e,header.JO_No)}
                    >
                      <img className='w-4' src='/icons/actions/approve.png' alt="approvers"/>
                      <span className='font-semibold tracking-wide'>Approval logs</span>
                    </button>
                  )}
                </div>
                {((header.xpost === 3 || header.xpost === 2) && !header.DISAPPROVED) && (
                  <button 
                    onClick={(e) => handleOpenAppOptions(e,header.JO_No)}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizIcon />
                  </button>
                )}
              </div>
              
              {/* Items section */}
              {viewItems[header.JO_No] && (
                <div className='flex flex-col text-sm'>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <div key={item.ID || index} className='flex flex-col gap-1 p-2 '>
                        <span
                          onClick={() => handleShowItems(item)} 
                          className='text-blue-600 hover:text-blue-800 hover:underline'
                        >
                          {item.FAC_name}
                        </span>   
                        {item.workDet && (
                          <span className='text-gray-600'>
                            {item.workDet}
                          </span>
                        )}
                        <div className='flex items-center text-xs text-slate-500'>
                          <span>Target Date:</span>
                          <span className='font-medium'>{item.TargetDate}</span>               
                        </div>                                      
                      </div>
                    ))
                  ) : (
                    <div className='text-sm italic text-center text-gray-500'>
                      No items found for this job order.
                    </div>
                  )}
                </div>
              )}
              
              {/* Show approval logs */}
              {viewApprovers[header.JO_No] && logs.length > 0 && (
                <div className='flex flex-col px-3 mt-2 text-sm'>
                  {logs.map((log, idx) => (
                    <div key={idx} className="py-2 border-b border-gray-100 last:border-0">
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='w-5'>
                            {log.STAT !== 'Disapproved' ? 
                              <CheckCircleIcon fontSize='small' className='text-green-500' /> : 
                              <CancelIcon fontSize='small' className='text-red-500'/>
                            }
                          </span>
                          <span className="font-medium">{log.X_USER?.split('-')[1]}</span>
                        </div>
                        <div className='flex gap-2 text-xs text-gray-500'>
                          <span>{log.STAT === 'Disapproved' ? 'Rejected' : log.STAT}</span>
                          <span><DateDisplay value={log.DT} format="short" /></span>       
                        </div>                             
                      </div>
                      {log.REMARKS && (
                        <div className='pt-1 text-xs italic text-gray-600 pl-7'>
                          "{log.REMARKS}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Individual Approval Modal  */}
              {openAppOptions[header.JO_No] && ReactDOM.createPortal(
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-end z-[99999] animate-fade-in'>
                  <div 
                    className='w-full bg-white shadow-xl rounded-t-2xl animate-slide-up'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='sticky top-0 px-6 py-4 bg-white border-b rounded-t-2xl'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>Job Order Approval</h3>
                          <p className='text-sm text-gray-500'>{header.JO_No}</p>
                        </div>
                        <button 
                          onClick={() => handleCloseAppOptions(header.JO_No)}
                          className="p-1 transition-colors rounded-full hover:bg-gray-100"
                        >
                          <KeyboardArrowDownIcon />
                        </button>
                      </div>
                    </div>
                    
                    <div className='p-6'>
                      <div className='mb-4'>
                        <label className='block mb-2 text-sm font-medium text-gray-700'>
                          Remarks <span className="text-red-500">*</span>
                        </label>
                        <TextareaAutosize
                          minRows={3}
                          placeholder="Please enter your approval/rejection remarks..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={remarks[header.JO_No] || ''}
                          onChange={(e) => handleRemarksChange(header.JO_No, e.target.value)}
                          disabled={processingJO === header.JO_No}
                          autoFocus
                        />
                      </div>
                      
                      <div className='flex flex-col gap-3'>
                        <button 
                          className='flex-1 py-3 tracking-wide text-white transition-colors bg-green-600 rounded-full shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={() => handleApprove(header.JO_No)}
                          disabled={processingJO === header.JO_No}
                        >
                          {processingJO === header.JO_No ? (
                            <div className="flex items-center justify-center gap-2">
                              <CircularProgress size={20} color="inherit" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button 
                          className='flex-1 py-3 tracking-wide text-red-600 transition-colors border border-red-400 rounded-full hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={() => handleReject(header.JO_No)}
                          disabled={processingJO === header.JO_No}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
              
              {/* Asset Details Modal */}
              {selectedDetails && ReactDOM.createPortal(
                <div 
                  className='animate-fade-in'
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "hsla(0, 0%, 20%, 0.1)",
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    zIndex: 9999999,
                  }}
                  onClick={handleCloseDetails}
                >
                  <div 
                    className='bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl shadow-xl animate-slide-up'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='sticky top-0 px-6 py-4 bg-white border-b'>
                      <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                          Asset Details
                        </h2>
                        <button 
                          onClick={handleCloseDetails}
                          className="p-1 transition-colors rounded-full hover:bg-gray-100"
                        >
                          <KeyboardArrowDownIcon />
                        </button>
                      </div>
                    </div>
                    
                    <div className='p-6'>
                      <div className='pb-3 mb-4 border-b'>
                        <h3 className='font-semibold text-blue-700 text-md'>{selectedDetails.FAC_name}</h3>
                        <p className='text-sm text-gray-500'>Asset No: {selectedDetails.FAC_NO}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="mb-1 text-gray-500">JO Number</div>
                          <div className="font-medium">{selectedDetails.JO_No}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-gray-500">Quantity</div>
                          <div className="font-medium">{selectedDetails.qty} {selectedDetails.UOM}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-gray-500">Target Date</div>
                          <div className="font-medium">{selectedDetails.TargetDate}</div>
                        </div>
                        
                        {selectedDetails.workDet && (
                          <div className="col-span-2">
                            <div className="mb-1 text-gray-500">Work Details</div>
                            <div className="text-gray-700">{selectedDetails.workDet}</div>
                          </div>
                        )}
                        
                        {selectedDetails.eval_status && (
                          <>
                            <div>
                              <div className="mb-1 text-gray-500">Evaluation Status</div>
                              <div className="font-medium">{selectedDetails.eval_status}</div>
                            </div>
                            <div>
                              <div className="mb-1 text-gray-500">Evaluation Remarks</div>
                              <div className="text-gray-700">{selectedDetails.eval_remarks}</div>
                            </div>
                          </>
                        )}
                        
                        {selectedDetails.Main_Status && (
                          <>
                            <div>
                              <div className="mb-1 text-gray-500">Maintenance Status</div>
                              <div className="font-medium">{selectedDetails.Main_Status}</div>
                            </div>
                            {selectedDetails.Main_Remarks && (
                              <div>
                                <div className="mb-1 text-gray-500">Maintenance Note</div>
                                <div className="text-gray-700">{selectedDetails.Main_Remarks}</div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {selectedDetails.brand && (
                          <div>
                            <div className="mb-1 text-gray-500">Brand</div>
                            <div className="font-medium">{selectedDetails.brand}</div>
                          </div>
                        )}
                        
                        {selectedDetails.serialno && (
                          <div>
                            <div className="mb-1 text-gray-500">Serial Number</div>
                            <div className="font-mono text-sm font-medium">{selectedDetails.serialno}</div>
                          </div>
                        )}
                        
                        {selectedDetails.disposal_reason && (
                          <div className="col-span-2">
                            <div className="mb-1 text-gray-500">Disposal Reason</div>
                            <div className="text-red-600">{selectedDetails.disposal_reason}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          );
        })
      )}
      
      {/* CSS animations - Keep your existing styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default MvJOForm;