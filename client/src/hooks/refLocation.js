import {useState, useEffect} from 'react';
import { api } from '../api/axios'

export const useRefLocation = () => {
  
  const [refLocData, setRefLocData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  //  Test API connection
    const testAPI = async () => {
      try {
        const response = await api.get('/refLocation/test');
        // console.log('API Test Response:', response.data);
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

          const response = await api.get('/refLocation');          
          const data = response.data;
          
          if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
          }
          
          const dataWithID = data.map((item, index) => ({
            ...item,
            id: item.id || `temp-${index}`,
            LocationName: item.LocationName 
          }));
          
          setRefLocData(dataWithID);
          
        } catch (error) {
          setError(error.response?.data?.error || error.message || 'Failed to fetch locations');

        } finally {
          setLoading(false);
        }
      };
      
      getrefLocation();
    }, []);
  
    // Create LocationName 
    const createRefLocation = async (LocationName ='') => {
      try {
        setActionLoading(true);
        setError(null)
        
        const response = await api.post('/refLocation', { LocationName });
        
        const created = {
          id: response.data.id,
          LocationName: response.data.LocationName
        }
        
        setRefLocData(prev => [...prev, created])
        return created;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to create Location';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Update LocationName - UPDATED TO SEND CORRECT FIELDS
    const updateRefLocation = async (id,  LocationName = '') => {
      try {
        setActionLoading(true);
        
        const response = await api.put(`/refLocation/${id}`, { LocationName });
        
        // Update local state
        setRefLocData(prev => prev.map(item => item.id == id ? { ...item, LocationName} : item));
        
        return response.data;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to update LocationName';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Delete LocationName
    const deleteRefLocation = async (id) => {
      try {
        setActionLoading(true);        
        const response = await api.delete(`/refLocation/${id}`);
        
        // Update local state
        setRefLocData(prev => prev.filter(item => item.id != id));
        
        return response.data;

      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || 'Failed to delete LocationName';
        setError(errorMsg);
        throw new Error(errorMsg);

      } finally {
        setActionLoading(false);
      }
    };
  
    // Refresh locations
    const refreshRefLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/refLocation');
        
        setRefLocData(response.data);

      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch locations');
        throw error;

      } finally {
        setLoading(false);
      }
    };
  

  return {
    refLocData, 
    loading, 
    error,
    actionLoading,
    createRefLocation,
    updateRefLocation,
    deleteRefLocation,
    refreshRefLocation,
    testAPI
  }
}