import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { TextareaAutosize, CircularProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function BulkApprovalDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedCount,
  loading 
}) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!remarks.trim()) {
      // Show error within dialog
      return;
    }
    onConfirm(remarks);
  };

  return ReactDOM.createPortal(
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
                You are about to approve {selectedCount} job order{selectedCount > 1 ? 's' : ''}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 transition-colors rounded-full hover:bg-gray-100"
              disabled={loading}
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
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          
          <div className='flex flex-col gap-3'>
            <button 
              className='flex-1 py-3 tracking-wide text-white transition-colors bg-green-600 rounded-full shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleConfirm}
              disabled={loading || !remarks.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Approve All (${selectedCount})`
              )}
            </button>
            <button 
              className='flex-1 py-3 tracking-wide text-gray-600 transition-colors border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default BulkApprovalDialog;