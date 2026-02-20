import {useState, useEffect} from 'react';
import { api } from '../api/axios'


export const useRefDepartment = () => {
  
  const [refDeptData, setRefDeptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  
    // GET all locations
    useEffect(() => {
      const getrefDepartment = async () => {
        try {
          setLoading(true);
          setError(null);

          
          const response = await api.get('/refDepartment');          
          const data = response.data;
          
          if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
          }
          
          const dataWithID = data.map((item, index) => ({
            ...item,
            id: item.id || `temp-${index}`,
            Department: item.Department 
          }));
          
          setRefDeptData(dataWithID);
          
        } catch (error) {
          setError(error.response?.data?.error || error.message || 'Failed to fetch Departments');

        } finally {
          setLoading(false);
        }
      };
      
      getrefDepartment();
    }, []);
  
    // Create Department - UPDATED TO SEND CORRECT FIELDS
    const createRefDepartment = async (Department ='') => {
      try {
        setActionLoading(true);
        setError(null)
        
        const response = await api.post('/refDepartment', { Department });
        
        const created = {
          id: response.data.id,
          Department: response.data.Department,
        }
        
        setRefDeptData(prev => [...prev, created]);
        return created;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create Location';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Update Department 
    const updateRefDepartment = async (id,  Department = '') => {
      try {
        setActionLoading(true);
        
        const response = await api.put(`/refDepartment/${id}`, { Department });
        
        // Update local state
        setRefDeptData(prev => prev.map(item => item.id == id ? { ...item, Department} : item));
        
        return response.data;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to update Department';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Delete Department
    const deleteRefDepartment = async (id) => {
      try {
        setActionLoading(true);
       
        const response = await api.delete(`/refDepartment/${id}`);
        
        // Update local state
        setRefDeptData(prev => prev.filter(item => item.id != id));
        
        return response.data;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to delete Department';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Refresh Departments
    const refreshRefDepartment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/refDepartment');
        
        setRefDeptData(response.data);

      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch Departments');
        throw error;

      } finally {
        setLoading(false);
      }
    };
  

  return {
    refDeptData, 
    loading, 
    error,
    actionLoading,
    createRefDepartment,
    updateRefDepartment,
    deleteRefDepartment,
    refreshRefDepartment,
  }
}