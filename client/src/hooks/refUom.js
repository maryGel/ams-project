import {useState, useEffect} from 'react';
import axios from 'axios';


// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});


export const useRefUom = () => {
  
  const [uomData, setUomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  //  Test API connection
    const testAPI = async () => {
      try {
        const response = await api.get('/api/refUnit/test');
        console.log('API Test Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Test Failed:', error);
        throw error;
      }
    };
  
    // GET all categories
    useEffect(() => {
      const getrefUnit = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Test API first
          await testAPI();
          
          // Then fetch categories
          console.log('Fetching categories...');
          const response = await api.get('/api/refUnit');
          console.log('Categories response:', response.data);
          
          const data = response.data;
          
          if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
          }
          
          const dataWithID = data.map((item, index) => ({
            ...item,
            id: item.id || `temp-${index}`,
            Unit: item.Unit || item.name || 'Unit'
          }));
          
          setUomData(dataWithID);
          
        } catch (error) {
          console.error('Error in getrefUnit:', error);
          setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
        } finally {
          setLoading(false);
        }
      };
      
      getrefUnit();
    }, []);
  
    // Create Unit - UPDATED TO SEND CORRECT FIELDS
    const createRefUnit = async (Unit ='') => {
      try {
        setActionLoading(true);
        console.log('Creating UOM:', { Unit });
        
        const response = await api.post('/api/refUnit', { Unit });
        console.log('Create response:', response.data);
        
        // Refresh the list
        await refreshRefUnit();
        
        return response.data;
      } catch (error) {
        console.error('Error creating UOM:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create UOM';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setActionLoading(false);
      }
    };
  
    // Update Unit - UPDATED TO SEND CORRECT FIELDS
    const updateRefUnit = async (id,  Unit = '') => {
      try {
        setActionLoading(true);
        console.log(`Updating Unit ${id} to:`, { Unit });
        
        const response = await api.put(`/api/refUnit/${id}`, { Unit });
        console.log('Update response:', response.data);
        
        // Update local state
        setUomData(prev => 
          prev.map(item => 
            item.id == id ? { ...item, Unit} : item
          )
        );
        
        return response.data;
      } catch (error) {
        console.error('Error updating Unit:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to update Unit';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setActionLoading(false);
      }
    };
  
    // Delete Unit
    const deleteRefUnit = async (id) => {
      try {
        setActionLoading(true);
        console.log('Deleting Unit:', id);
        
        const response = await api.delete(`/api/refUnit/${id}`);
        console.log('Delete response:', response.data);
        
        // Update local state
        setUomData(prev => prev.filter(item => item.id != id));
        
        return response.data;
      } catch (error) {
        console.error('Error deleting Unit:', error);
        const errorMsg = error.response?.data?.error || error.message || 'Failed to delete Unit';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setActionLoading(false);
      }
    };
  
    // Refresh categories
    const refreshRefUnit = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/refUnit');
        const data = response.data;
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          Unit: item.Unit || item.name || 'Unnamed Unit'
        }));
        
        setUomData(dataWithID);
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
        throw error;
      } finally {
        setLoading(false);
      }
    };
  

  return {
    uomData, 
    loading, 
    error,
    actionLoading,
    createRefUnit,
    updateRefUnit,
    deleteRefUnit,
    refreshRefUnit,
    testAPI
  }
}