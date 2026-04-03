import { useState } from 'react';
import axios from 'axios';

export const useTRApproval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const approveTR = async (TR_No, remarks, userInfo, appLevel = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/trApproval/approve/${encodeURIComponent(TR_No)}`, {
        approved_by: userInfo?.userId || userInfo?.user,
        remarks,
        userInfo: {
          user: userInfo?.user,
          fname: userInfo?.fname,
          lname: userInfo?.lname,
          multiApp: userInfo?.multiApp
        },
        appLevel // Optional: specify which level to approve
      });
      
      setLoading(false);
      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message
      };
      
    } catch (err) {
      console.error('Approve error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to approve transfer request';
      setError(errorMessage);
      setLoading(false);
      return { 
        success: false, 
        error: errorMessage,
        requiredAppCode: err.response?.data?.requiredAppCode,
        userApps: err.response?.data?.userApps
      };
    }
  };
  
  const rejectTR = async (TR_No, remarks, userInfo, appLevel = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/trApproval/reject/${encodeURIComponent(TR_No)}`, {
        approved_by: userInfo?.userId || userInfo?.user,
        remarks,
        userInfo: {
          user: userInfo?.user,
          fname: userInfo?.fname,
          lname: userInfo?.lname,
          multiApp: userInfo?.multiApp
        },
        appLevel // Optional: specify which level is being rejected
      });
      
      setLoading(false);
      return { success: true, data: response.data.data, message: response.data.message };
      
    } catch (err) {
      console.error('Reject error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to reject transfer request';
      setError(errorMessage);
      setLoading(false);
      return { 
        success: false, 
        error: errorMessage,
        requiredAppCode: err.response?.data?.requiredAppCode,
        userApps: err.response?.data?.userApps
      };
    }
  };
  
  /**
   * Get the current approval status of a document
   * @param {string} TR_No - Transfer document number
   * @returns {Promise<Object>} Approval status details
   */
  const getApprovalStatus = async (TR_No) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/trApproval/status/${encodeURIComponent(TR_No)}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error getting approval status:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get approval status';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };
  
  /**
   * Check the next approval level available for a document
   * @param {string} TR_No - Transfer document number
   * @returns {Promise<Object>} Next level information
   */
  const checkNextLevel = async (TR_No) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`/trApproval/check-next-level/${encodeURIComponent(TR_No)}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error checking next level:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to check next approval level';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };
  
  /**
   * Check if user has approval rights for a specific level
   * @param {Array} userMultiApp - User's multi-approval codes
   * @param {string} module - Module name (e.g., 'Transfer (Internal)')
   * @param {number} level - Approval level to check
   * @returns {Promise<Object>} Rights information
   */
  const checkApprovalRights = async (userMultiApp, module, level) => {
    try {
      const response = await axios.post('/trApproval/check-rights', {
        userMultiApp,
        module,
        level
      });
      return response.data;
    } catch (err) {
      console.error('Error checking rights:', err);
      return { hasRights: false, requiredAppCode: null };
    }
  };
  
  /**
   * Get xpost status text description
   * @param {number} xpost - xpost value (1, 2, or 3)
   * @returns {string} Status description
   */
  const getXpostStatusText = (xpost) => {
    switch(xpost) {
      case 1: return 'Fully Approved';
      case 2: return 'Partially Approved';
      case 3: return 'For Approval';
      default: return 'Unknown';
    }
  };
  
  /**
   * Check if document can be approved based on current status
   * @param {Object} docStatus - Document status object
   * @returns {Object} Approval availability
   */
  const canApprove = (docStatus) => {
    if (!docStatus) return { canApprove: false, reason: 'No document status available' };
    
    if (docStatus.disapproved === 1) {
      return { canApprove: false, reason: 'Document has been disapproved' };
    }
    
    if (docStatus.xpost === 1) {
      return { canApprove: false, reason: 'Document is already fully approved' };
    }
    
    if (docStatus.xpost === 3) {
      return { canApprove: true, reason: 'Ready for initial approval' };
    }
    
    if (docStatus.xpost === 2) {
      return { canApprove: true, reason: 'Ready for next level approval' };
    }
    
    return { canApprove: false, reason: 'Document not ready for approval' };
  };
  
  /**
   * Get the next approver level based on current appStat
   * @param {string} appStat - Current appStat value (e.g., "1,2")
   * @param {number} totalLevels - Total number of approval levels
   * @returns {number|null} Next level or null if fully approved
   */
  const getNextApproverLevel = (appStat, totalLevels) => {
    if (!appStat || appStat === '') {
      return 1; // Start with level 1
    }
    
    const approvedLevels = appStat.split(',').map(l => parseInt(l.trim())).filter(l => !isNaN(l));
    const nextLevel = approvedLevels.length + 1;
    
    return nextLevel <= totalLevels ? nextLevel : null;
  };
  
  return {
    // Main functions
    approveTR,
    rejectTR,
    getApprovalStatus,
    checkNextLevel,
    checkApprovalRights,
    
    // Helper functions
    getXpostStatusText,
    canApprove,
    getNextApproverLevel,
    
    // State
    loading,
    error
  };
};