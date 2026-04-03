// hooks/useAssetLostApproval.js
import { useState } from 'react';
import axios from 'axios';

export const useAssetLostApproval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const approveAssetLost = async (AAFNO, remarks, userInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/lostApproval/approve/${encodeURIComponent(AAFNO)}`, {
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
      const errorMessage = err.response?.data?.error || err.message || 'Failed to approve asset lost';
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
  
  const rejectAssetLost = async (AAFNO, remarks, userInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/lostApproval/reject/${encodeURIComponent(AAFNO)}`, {
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
      const errorMessage = err.response?.data?.error || err.message || 'Failed to reject asset lost';
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
      const response = await axios.post('/lostApproval/check-rights', {
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
    approveAssetLost,
    rejectAssetLost,
    checkApprovalRights,
    loading,
    error
  };
};