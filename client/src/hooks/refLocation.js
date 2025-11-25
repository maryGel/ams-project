import {useState, useEffect} from 'react';
import axios from 'axios';


// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});


export const useRefLocation = () => {
  
  const [refLocData, setRefLocData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  //  Test API connection
    const testAPI = async () => {
      try {
        const response = await api.get('/refLocation/test');
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
          
          // Then fetch locations
          console.log('Fetching location...');
          const response = await api.get('/refLocation');
          // console.log('Locations response:', response.data);
          
          const data = response.data;
          
          if (!Array.isArray(data)) {
            throw new Error('Expected array but got: ' + typeof data);
          }
          
          const dataWithID = data.map((item, index) => ({
            ...item,
            id: item.id || `temp-${index}`,
            LocationName: item.LocationName || item.name || 'LocationName'
          }));
          
          setRefLocData(dataWithID);
          
        } catch (error) {
          console.error('Error in getrefLocation:', error);
          setError(error.response?.data?.error || error.message || 'Failed to fetch locations');
        } finally {
          setLoading(false);
        }
      };
      
      getrefLocation();
    }, []);
  
    // Create LocationName - UPDATED TO SEND CORRECT FIELDS
    const createRefLocation = async (LocationName ='') => {
      try {
        setActionLoading(true);
        console.log('Creating Location:', { LocationName });
        
        const response = await api.post('/refLocation', { LocationName });
        console.log('Create response:', response.data);
        
        // Refresh the list
        await refreshRefLocation();
        
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
  
    // Update LocationName - UPDATED TO SEND CORRECT FIELDS
    const updateRefLocation = async (id,  LocationName = '') => {
      try {
        setActionLoading(true);
        console.log(`Updating LocationName ${id} to:`, { LocationName });
        
        const response = await api.put(`/refLocation/${id}`, { LocationName });
        console.log('Update response:', response.data);
        
        // Update local state
        setRefLocData(prev => 
          prev.map(item => 
            item.id == id ? { ...item, LocationName} : item
          )
        );
        
        return response.data;
      } catch (error) {
        console.error('Error updating LocationName:', error);
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
        console.log('Deleting LocationName:', id);
        
        const response = await api.delete(`/refLocation/${id}`);
        console.log('Delete response:', response.data);
        
        // Update local state
        setRefLocData(prev => prev.filter(item => item.id != id));
        
        return response.data;
      } catch (error) {
        console.error('Error deleting LocationName:', error);
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
        const response = await api.get('/refLocation');
        const data = response.data;
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          LocationName: item.LocationName || item.name || 'Unnamed LocationName'
        }));
        
        setRefLocData(dataWithID);
        setError(null);
      } catch (error) {
        console.error('Error fetching locations:', error);
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