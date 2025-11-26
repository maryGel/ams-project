import {useState, useEffect} from 'react';
import axios from 'axios';


// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});


export const useRefDepartment = () => {
  
  const [refDeptData, setRefDeptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  //  Test API connection
    const testAPI = async () => {
      try {
        const response = await api.get('/refDepartment/test');
        console.log('API Test Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Test Failed:', error);
        throw error;
      }
    };
  
    // GET all locations
    useEffect(() => {
      const getrefLocation = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Test API first
          await testAPI();
          
          // Then fetch Departments
          console.log('Fetching Departments...');
          const response = await api.get('/refDepartment');
          // console.log('Deparment response:', response.data);
          
          const data = response.data;
          
          if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
          }
          
          const dataWithID = data.map((item, index) => ({
            ...item,
            id: item.id || `temp-${index}`,
            Department: item.Department || item.name || 'Department'
          }));
          
          setRefDeptData(dataWithID);
          
        } catch (error) {
          console.error('Error in getrefLocation:', error);
          setError(error.response?.data?.error || error.message || 'Failed to fetch Departments');
        } finally {
          setLoading(false);
        }
      };
      
      getrefLocation();
    }, []);
  
    // Create Department - UPDATED TO SEND CORRECT FIELDS
    const createRefDepartment = async (Department ='') => {
      try {
        setActionLoading(true);
        console.log('Creating Location:', { Department });
        
        const response = await api.post('/refDepartment', { Department });
        console.log('Create response:', response.data);
        
        // Refresh the list
        await refreshRefDepartment();
        
        return response.data;
      } catch (error) {
        console.error('Error creating Location:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create Location';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setActionLoading(false);
      }
    };
  
    // Update Department - UPDATED TO SEND CORRECT FIELDS
    const updateRefDepartment = async (id,  Department = '') => {
      try {
        setActionLoading(true);
        console.log(`Updating Department ${id} to:`, { Department });
        
        const response = await api.put(`/refDepartment/${id}`, { Department });
        console.log('Update response:', response.data);
        
        // Update local state
        setRefDeptData(prev => 
          prev.map(item => 
            item.id == id ? { ...item, Department} : item
          )
        );
        
        return response.data;
      } catch (error) {
        console.error('Error updating Department:', error);
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
        console.log('Deleting Department:', id);
        
        const response = await api.delete(`/refDepartment/${id}`);
        console.log('Delete response:', response.data);
        
        // Update local state
        setRefDeptData(prev => prev.filter(item => item.id != id));
        
        return response.data;
      } catch (error) {
        console.error('Error deleting Department:', error);
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
        const response = await api.get('/refDepartment');
        const data = response.data;
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          Department: item.Department || item.name || 'Unnamed Department'
        }));
        
        setRefDeptData(dataWithID);
        setError(null);
      } catch (error) {
        console.error('Error fetching Departments:', error);
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
    testAPI
  }
}