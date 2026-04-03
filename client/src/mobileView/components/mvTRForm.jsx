import { useState, useMemo, useRef, useCallback } from 'react';
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
import { useTRApproval } from '../../hooks/useTRApproval';
import {useApprovalLogs} from '../../hooks/useApprovalLogs';
// Custom Utils
import {borderColor} from '../customUtils/filters';

function MvTRForm({
    useProps,
    filteredTR,
    trDetails,
    isLoading,
    error,
    selectedUser,
    trRefresh, 
    trDetailsRefresh,
    selectionMode,
    selectedTR,
    setSelectedTR,
    onEnterSelectionMode,
    onExitSelectionMode,
    onSelectAll, 
    selectAll

}) {
    const { 
        approveTR,
        rejectTR,
        getApprovalStatus,
        getXpostStatusText,
        canApprove,
        loading: approvalLoading 
    } = useTRApproval();

    const {approvalLogs} = useApprovalLogs(useProps);
    const [viewItems, setViewItems] = useState({});
    const [viewApprovers, setViewApprovers] = useState({});
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [openAppOptions, setOpenAppOptions] = useState({});
    const [remarks, setRemarks] = useState({});
    const [processingTR, setProcessingTR] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [approvalInfoCache, setApprovalInfoCache] = useState({}); // Cache for approval info
    const [fetchingStatus, setFetchingStatus] = useState({}); // Track which TRs are being fetched

    // Bulk approval state
    const [bulkApprovalDialogOpen, setBulkApprovalDialogOpen] = useState(false);
    const [bulkApprovalRemarks, setBulkApprovalRemarks] = useState('');
    const [bulkApprovalLoading, setBulkApprovalLoading] = useState(false);
      
    const toastTimeoutRef = useRef(null);

    // Show toast with longer duration (5s) and pause on hover
    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });

        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
    }, []);

    // Fetch approval status on demand (when user opens approval modal)
    const fetchApprovalStatus = async (TR_No) => {
        if (fetchingStatus[TR_No]) return approvalInfoCache[TR_No];
        
        setFetchingStatus(prev => ({ ...prev, [TR_No]: true }));
        
        try {
            const result = await getApprovalStatus(TR_No);
            if (result.success) {
                setApprovalInfoCache(prev => ({
                    ...prev,
                    [TR_No]: result.data
                }));
                return result.data;
            }
        } catch (err) {
            console.error('Failed to fetch approval status:', err);
        } finally {
            setFetchingStatus(prev => ({ ...prev, [TR_No]: false }));
        }
        
        return null;
    };

    // Handle bulk approval with multi-level support
    const handleBulkApprove = async () => {
        if (selectedTR.length === 0) {
            showToast('No transfer orders selected', 'error');
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
            for (const trNo of selectedTR) {
                // Find the header to determine level
                const header = filteredTR.find(tr => tr.TR_No === trNo);
                let nextLevel = 1;
                
                // Determine level based on xpost and appStat
                if (header) {
                    if (header.xpost === 3) {
                        nextLevel = 1;
                    } else if (header.xpost === 2 && header.appStat) {
                        const approvedLevels = header.appStat.split(',').map(l => parseInt(l.trim()));
                        nextLevel = approvedLevels.length + 1;
                    }
                }
                
                const result = await approveTR(trNo, bulkApprovalRemarks, selectedUser, nextLevel);
                
                if (result.success) {
                    successCount++;
                    // Update cache with new data
                    setApprovalInfoCache(prev => ({
                        ...prev,
                        [trNo]: result.data
                    }));
                } else {
                    failCount++;
                    console.error(`Failed to approve TR ${trNo}:`, result.error);
                }
            }

            if (successCount > 0) {
                const message = `Approved ${successCount} transfer form${successCount > 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`;
                showToast(message, failCount === 0 ? 'success' : 'warning');
                
                setBulkApprovalDialogOpen(false);
                setBulkApprovalRemarks('');
                setSelectedTR([]);
                if (onExitSelectionMode) onExitSelectionMode();
                
                setTimeout(() => {
                    trRefresh?.();
                    trDetailsRefresh?.();
                }, 2000);
            } else {
                showToast(`Failed to approve all ${failCount} transfer orders`, 'error');
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
        if (selectedTR.length === 0) {
            showToast('No transfer orders selected', 'error');
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

    const handleViewItemsOpen = (e, TR_No) => {
        e.stopPropagation();
        setViewItems(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        setViewApprovers(prev => ({
            ...prev,
            [TR_No]: false
        }));
    };

    const handleViewApprovers = (e, TR_No) => {
        e.stopPropagation();
        setViewApprovers(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        setViewItems(prev => ({
            ...prev,
            [TR_No]: false
        }));
    };

    const handleOpenAppOptions = async (e, TR_No) => {
        e.stopPropagation();
        
        // Fetch approval status when opening modal
        await fetchApprovalStatus(TR_No);
        
        setOpenAppOptions(prev => ({
            ...prev,
            [TR_No]: !prev[TR_No]
        }));
        document.body.style.overflow = 'hidden';
    };

    const handleCloseAppOptions = (TR_No) => {
        setOpenAppOptions(prev => ({
            ...prev,
            [TR_No]: false
        }));
        document.body.style.overflow = 'unset';
        setRemarks(prev => ({
            ...prev,
            [TR_No]: ''
        }));
        setProcessingTR(null);
    };

    const handleShowItems = (item) => {
        setSelectedDetails(item);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseDetails = () => {
        setSelectedDetails(null);
        document.body.style.overflow = 'unset';
    };

    const handleRemarksChange = (TR_No, value) => {
        setRemarks(prev => ({
            ...prev,
            [TR_No]: value
        }));
    };

    const longPressTimeout = useRef(null);
    
    const handleLongPressStart = (header) => {
        const canBeApproved = canApprove(header);
        
        if (canBeApproved.canApprove && header.xpost !== 1 && header.DISAPPROVED !== 1) {
            longPressTimeout.current = setTimeout(() => {
                if (onEnterSelectionMode) onEnterSelectionMode(header.TR_No);
            }, 500);
        }
    };

    const handleLongPressEnd = () => {
        if (longPressTimeout.current) {
            clearTimeout(longPressTimeout.current);
        }
    };

    // Approval Flow with multi-level support
    const handleApprove = async (TR_No) => {
        const remarkText = remarks[TR_No] || '';
        
        if (!remarkText.trim()) {
            showToast('Please provide remarks for approval', 'error');
            return;
        }
        
        setProcessingTR(TR_No);
        
        // Find the header to determine level
        const header = filteredTR.find(tr => tr.TR_No === TR_No);
        let nextLevel = 1;
        
        if (header) {
            if (header.xpost === 3) {
                nextLevel = 1;
            } else if (header.xpost === 2 && header.appStat) {
                const approvedLevels = header.appStat.split(',').map(l => parseInt(l.trim()));
                nextLevel = approvedLevels.length + 1;
            }
        }
        
        const result = await approveTR(TR_No, remarkText, selectedUser, nextLevel);
        
        if (result.success) {
            const statusMessage = result.data.isFinalApproval 
                ?  `Transfer Form ${TR_No} fully approved! `
                : `Successfully approved this ${TR_No}. `;
            
            showToast(`${statusMessage}`, 'success');
            handleCloseAppOptions(TR_No);
            
            // Update cache
            setApprovalInfoCache(prev => ({
                ...prev,
                [TR_No]: result.data
            }));
            
            setTimeout(() => {
                trRefresh?.();
                trDetailsRefresh?.();
            }, 2000);
            
            setProcessingTR(null);
        } else {
            if (result.requiredAppCode) {
                showToast(`Access denied. Required: ${result.requiredAppCode}`, 'error');
            } else {
                showToast(`Error: ${result.error}`, 'error');
            }
            setProcessingTR(null);
        }
    };

    const handleReject = async (TR_No) => {
        const remarkText = remarks[TR_No] || '';
        
        if (!remarkText.trim()) {
            showToast('Please provide remarks for rejection', 'error');
            return;
        }
        
        setProcessingTR(TR_No);
        
        // Find the header to determine level
        const header = filteredTR.find(tr => tr.TR_No === TR_No);
        let currentLevel = 1;
        
        if (header) {
            if (header.xpost === 3) {
                currentLevel = 1;
            } else if (header.xpost === 2 && header.appStat) {
                const approvedLevels = header.appStat.split(',').map(l => parseInt(l.trim()));
                currentLevel = approvedLevels.length + 1;
            }
        }
        
        const result = await rejectTR(TR_No, remarkText, selectedUser, currentLevel);
        
        if (result.success) {
            showToast('Transfer rejected successfully', 'success');
            handleCloseAppOptions(TR_No);
            
            if (trRefresh) {
                trRefresh?.();
                trDetailsRefresh?.();
            }
            
            setProcessingTR(null);
        } else {
            showToast(`Error: ${result.error}`, 'error');
            setProcessingTR(null);
        }
    };

    // Filter trDetails by TR_No & Approval logs by TR_No
    const getItemsByTRNo = (TR_No) => {
        return trDetails?.filter(detail => detail.TR_No === TR_No) || [];
    };
    
    const getAppLogByTRNo = (TR_No) => {
        return approvalLogs?.filter(log => (log.TRNO === TR_No) && log.Module === 'Transfer (Internal)') || [];
    };

    // Sort the filteredTR array by date (latest first)
    const sortedFilteredTR = useMemo(() => {
        if (!filteredTR) return [];
        
        return [...filteredTR].sort((a, b) => {
            return b.TR_No.localeCompare(a.TR_No);
        });
    }, [filteredTR]);

    // Get status badge color and text
    const getStatusBadge = (header) => {
        if (header.DISAPPROVED === 1) {
            return { text: 'Rejected', color: 'text-slate-400' };
        }
        
        if (header.xpost === 1) {
            return { text: 'Fully Approved', color: 'text-slate-400' };
        }
        
        if (header.xpost === 2) {
            const approvedLevels = header.appStat ? header.appStat.split(',').length : 0;
            const totalLevels = 3; // You can make this dynamic based on config
            return { 
                text: `Partially Approved (${approvedLevels}/${totalLevels})`, 
                color: 'bg-yellow-100 text-yellow-800' 
            };
        }
        
        if (header.xpost === 3) {
            return { text: 'For Approval', color: 'bg-gray-100 text-gray-800' };
        }
        
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    };

    // Check if TR is eligible for selection
    const isEligibleForSelection = (header) => {
        const approvalCheck = canApprove(header);
        return approvalCheck.canApprove && header.DISAPPROVED !== 1 && header.xpost !== 1;
    };

    // Get next level for display
    const getNextLevel = (header) => {
        if (header.xpost === 3) return 1;
        if (header.xpost === 2 && header.appStat) {
            const approvedLevels = header.appStat.split(',').length;
            return approvedLevels + 1;
        }
        return null;
    };

    // Get approved levels count
    const getApprovedLevelsCount = (header) => {
        if (header.xpost === 3) return 0;
        if (header.xpost === 2 && header.appStat) {
            return header.appStat.split(',').length;
        }
        if (header.xpost === 1) return 3; // Assuming 3 levels total
        return 0;
    };

    // Show loading state while refreshing
    if (isLoading || approvalLoading) return (
        <div className="flex flex-col items-center justify-center py-8">
            <CircularProgress />
            <span className="mt-3 text-sm text-gray-500">Loading transfer orders...</span>
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
                                    You are about to approve {selectedTR.length} transfer form{selectedTR.length > 1 ? 's' : ''}
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
                                placeholder="Please enter your approval remarks for all selected transfer orders..."
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
                                        <span>Processing {selectedTR.length} TR{selectedTR.length > 1 ? 's' : ''}...</span>
                                    </div>
                                ) : (
                                    `Approve All (${selectedTR.length})`
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
        {selectionMode && selectedTR.length > 0 && (
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 text-xs border-b border-blue-200 bg-blue-50">
                <span className="font-medium text-blue-700">
                    {selectedTR.length} transfer form{selectedTR.length > 1 ? 's' : ''} selected
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

        {sortedFilteredTR?.map((header) => {
            const items = getItemsByTRNo(header.TR_No);
            const logs = getAppLogByTRNo(header.TR_No);
            const statusBadge = getStatusBadge(header);
            const eligibleForSelection = isEligibleForSelection(header);
            const nextLevel = getNextLevel(header);
            const approvedLevelsCount = getApprovedLevelsCount(header);
            const totalLevels = 3; // You can make this configurable
            
            return (
                <div 
                    key={header?.ID} 
                    className={clsx(
                        "flex flex-col mx-3 gap-1 p-2 border border-spacing-1 shadow-md rounded-xl",
                        // borderColor(header.xpost, header.DISAPPROVED),
                        (selectedTR.includes(header.TR_No) && eligibleForSelection) && "bg-slate-200 border-blue-500",
                        !eligibleForSelection && "cursor-not-allowed "
                    )}
                    onClick={() => {
                        if (selectionMode && eligibleForSelection) {
                            if (selectedTR.includes(header.TR_No)) {
                                setSelectedTR(prev => prev.filter(j => j !== header.TR_No));
                            } else {
                                setSelectedTR(prev => [...prev, header.TR_No]);
                            }
                        }
                    }}
                    onTouchStart={() => handleLongPressStart(header)}
                    onTouchEnd={handleLongPressEnd}
                    longTouchDelay={500}
                >
                    <div className='flex justify-end'>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusBadge.color}`}>
                        {statusBadge.text}
                    </span>
                    </div>
                    <div className='flex justify-between px-2'>
                        <div className='flex items-center gap-2'>
                            <span className='font-sans text-sm font-semibold text-blue-900'>{header.TR_No}</span>
                        </div>
                        <span className='text-sm text-slate-500'><DateDisplay value={header.xDate} format="short" /></span>
                    </div>

                    <div className='flex flex-col px-2 text-sm tracking-wide text-slate-500'>
                        <span>{header.Department}</span>
                        <span> Holder: {header.Holder}</span>
                        <span>For Transfer to: {header.Location}</span>
                        <div className='flex justify-start gap-2 mt-1 '>
                            <span>Remarks:</span>
                            <span className='text-black'>{header.Remarks}</span>
                        </div>
                    </div>

                    {/* Button to View Items and Approvers */}
                    <div className='flex flex-row justify-between px-2 border-t-2'>
                        <div className='flex gap-3'>
                            <button 
                                className={clsx(
                                    'flex gap-1 text-xs items-center mt-1 px-3 py-1 border rounded-full transition-all duration-200',
                                    !viewItems[header.TR_No] ? 'border-slate-400 hover:border-blue-500' : 'border-blue-500 text-blue-700 bg-blue-50'
                                )}
                                onClick={(e) => handleViewItemsOpen(e, header.TR_No)}
                            >
                                <img className='w-4' src='/icons/actions/boxes.png' alt="items"/>
                                <span className='font-semibold tracking-wide'>Items ({items.length})</span>
                            </button>
                            {(header.approved_by || logs.length > 0) && (
                                <button 
                                    className={clsx(
                                        'flex gap-1 text-xs items-center mt-1 px-2 border rounded-full transition-all duration-200',
                                        !viewApprovers[header.TR_No] ? 'border-slate-400 hover:border-blue-500' : 'border-blue-500 text-blue-700 bg-blue-50'
                                    )}
                                    onClick={(e) => handleViewApprovers(e, header.TR_No)}
                                >
                                    <img className='w-4' src='/icons/actions/approve.png' alt="approvers"/>
                                    <span className='font-semibold tracking-wide'>Approval logs</span>
                                </button>
                            )}
                        </div>
                        {eligibleForSelection && header.xpost !== 1 && header.DISAPPROVED !== 1 && (
                            <button 
                                onClick={(e) => handleOpenAppOptions(e, header.TR_No)}
                                className="p-1 transition-colors rounded-full hover:bg-gray-100"
                            >
                                <MoreHorizIcon />
                            </button>
                        )}
                    </div>

                    {/* Items section */}
                    {viewItems[header.TR_No] && (
                        <div className='flex flex-col text-sm'>
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <div key={item.ID || index} className='flex flex-col gap-1 p-2'>
                                        <span
                                            onClick={() => handleShowItems(item)} 
                                            className='text-blue-600 cursor-pointer hover:text-blue-800 hover:underline'
                                        >
                                            {item.FAC_name}
                                        </span>   
                                        {item.FAC_NO && (
                                            <span className='text-gray-600'>
                                                {item.FAC_NO}
                                            </span>
                                        )}                                    
                                    </div>
                                ))
                            ) : (
                                <div className='text-sm italic text-center text-gray-500'>
                                    No items found for this transfer form.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Show approval logs with level information */}
                    {viewApprovers[header.TR_No] && logs.length > 0 &&
                        <div className='flex flex-col px-3 mt-2 text-sm'>                                
                            {logs.map((log, idx) => (
                                <div key={idx} className='mb-2'>
                                    <div className='flex items-center justify-between mt-2'>
                                        <div className='flex items-center gap-1'>
                                            <span className='w-5 text-green-500'>
                                                {log.TRNO && log.STAT !== 'Disapproved' ? <CheckCircleIcon fontSize='small' /> : <CancelIcon fontSize='small' className='text-red-500'/>}
                                            </span>
                                            <span className='font-medium'>Level {log.APP_LEVEL}:</span>
                                            <span>{log.X_USER?.split('-')[1]}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            {log.STAT !== 'Disapproved' && 
                                            <span >
                                                {log.STAT}
                                            </span> }
                                            
                                            <span><DateDisplay value={log.DT} format="short" /></span>    
                                        </div>                                    
                                    </div>
                                    <span className='pt-1 pl-6 text-slate-500'>{log.REMARKS}</span>
                                </div>
                            ))}
                        </div>
                    }

                    {/* Individual Approval Modal with level info */}
                    {openAppOptions[header.TR_No] && ReactDOM.createPortal(
                        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-end z-[99999] animate-fade-in'>
                            <div 
                                className='w-full bg-white shadow-xl rounded-t-2xl animate-slide-up'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='sticky top-0 px-6 py-4 bg-white border-b rounded-t-2xl'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-900'>Transfer Form Approval</h3>
                                            <p className='text-sm text-gray-500'>{header.TR_No}</p>
                                            {nextLevel && (
                                                <p className='mt-1 text-xs text-blue-600'>
                                                    Level {nextLevel} of {totalLevels} Approval
                                                </p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleCloseAppOptions(header.TR_No)}
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
                                            placeholder={`Please provide your remarks here...`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={remarks[header.TR_No] || ''}
                                            onChange={(e) => handleRemarksChange(header.TR_No, e.target.value)}
                                            disabled={processingTR === header.TR_No}
                                            autoFocus
                                        />
                                    </div>
                                    
                                    <div className='flex flex-col gap-3'>
                                        <button 
                                            className='flex-1 py-3 tracking-wide text-white transition-colors bg-green-600 rounded-full shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={() => handleApprove(header.TR_No)}
                                            disabled={processingTR === header.TR_No || !remarks[header.TR_No]}
                                        >
                                            {processingTR === header.TR_No ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <CircularProgress size={20} color="inherit" />
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                `Approve`
                                            )}
                                        </button>
                                        <button 
                                            className='flex-1 py-3 tracking-wide text-red-600 transition-colors border border-red-400 rounded-full hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={() => handleReject(header.TR_No)}
                                            disabled={processingTR === header.TR_No || !remarks[header.TR_No] }
                                        >
                                            Reject
                                        </button>
                                    </div>
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
                                    <h2 className="text-sm font-semibold">
                                        Asset: {selectedDetails.FAC_name}
                                    </h2>
                                    <button 
                                        onClick={handleCloseDetails}
                                        className="text-base hover:text-gray-600"
                                    >
                                        <KeyboardArrowDownIcon />
                                    </button>
                                </div>
                                <div className='flex gap-2 py-1 mb-3 text-sm border-b'>
                                    <div className="text-gray-500">Asset No:</div>
                                    <div>{selectedDetails.FAC_NO}</div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <div className="text-gray-400">TR NO:</div>
                                        <div>{selectedDetails.TR_No}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Quantity</div>
                                        <div>{selectedDetails.qty}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">UOM</div>
                                        <div>{selectedDetails.UOM}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">New Holder</div>
                                        <div>{selectedDetails.New_Holder}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Acquired Date</div>
                                        <DateDisplay value={selectedDetails.Date_Aq} format="short" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Acquired Value</div>
                                        <div>{selectedDetails.Amount_aq}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Transfer from:</div>
                                        <div>{selectedDetails.Orig_Department}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Transfer to:</div>
                                        <div>{selectedDetails.New_Location}</div>
                                    </div>
                                    {selectedDetails.Brand &&
                                        <div>
                                            <div className="text-sm text-gray-400">Brand:</div>
                                            <div>{selectedDetails.brand}</div>
                                        </div>
                                    }
                                    {selectedDetails.serial_no &&
                                        <div>
                                            <div className="text-sm text-gray-400">Serial No:</div>
                                            <div>{selectedDetails.serialno}</div>
                                        </div>
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