// hooks/useDisposalApproval.js
import { useState } from 'react';
import axios from 'axios';

export const useDisposalApproval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const approveDisposal = async (AD_No, remarks, userInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/adApproval/approve/${encodeURIComponent(AD_No)}`, {
        approved_by: userInfo?.userId || userInfo?.user,
        remarks,
        userInfo: {
          user: userInfo?.user,
          fname: userInfo?.fname,
          lname: userInfo?.lname,
          multiApp: userInfo?.multiApp
        }
      });
      
      setLoading(false);
      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message
      };
      
    } catch (err) {
      console.error('Approve error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to approve job order';
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
  
  const rejectDisposal = async (AD_No, remarks, userInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/adApproval/reject/${encodeURIComponent(AD_No)}`, {
        approved_by: userInfo?.userId || userInfo?.user,
        remarks,
        userInfo: {
          user: userInfo?.user,
          fname: userInfo?.fname,
          lname: userInfo?.lname,
          multiApp: userInfo?.multiApp
        }
      });
      
      setLoading(false);
      return { success: true, data: response.data.data, message: response.data.message };
      
    } catch (err) {
      console.error('Reject error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to reject job order';
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
  

  
  const checkApprovalRights = async (userMultiApp, module, level) => {
    try {
      const response = await axios.post('/adApproval/check-rights', {
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
  
  return {
    approveDisposal,
    rejectDisposal,
    checkApprovalRights,
    loading,
    error
  };
};