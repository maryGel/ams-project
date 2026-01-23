import {useState, useEffect} from 'react';
import { api } from '../api/axios'


export const useRefBrand = () => {
  const [refBrandData, setRefBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Test API connection
  const testAPI = async () => {
    try {
      const response = await api.get('/refBrand/test');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // GET all brands
  useEffect(() => {
    const getRefBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await testAPI();
        
        const response = await api.get('/refBrand');       
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          BrandID: item.BrandID,
          BrandName: item.BrandName
        }));
        
        setRefBrandData(dataWithID);
        
      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    getRefBrand();
  }, []);

  // Create BrandName - UPDATED TO SEND CORRECT FIELDS
  const createrefBrand = async (BrandID ='', BrandName ) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await api.post('/refBrand', { BrandID, BrandName });
      
      const created = {
        id: response.data.id,
        BrandID: response.data.BrandID,
        BrandName: response.data.BrandName
      }

      setRefBrandData(prev => [...prev, created]);      
      return created;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create BrandName';
      setError(errorMsg);
      throw new Error(errorMsg);

    } finally {
      setActionLoading(false);
    }
  };

  // Update BrandName - UPDATED TO SEND CORRECT FIELDS
  const updaterefBrand = async (id,  BrandID = '', BrandName) => {
    try {
      setActionLoading(true);
      
      const response = await api.put(`/refBrand/${id}`, { BrandID, BrandName });
      
      // Update local state
      setRefBrandData(prev => 
        prev.map(item => 
          item.id == id ? { ...item, BrandID, BrandName} : item
        )
      );
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update BrandName';
      setError(errorMsg);
      throw new Error(errorMsg);    
    } finally {
      setActionLoading(false);
    }
  };

  // Delete BrandName
  const deleterefBrand = async (id) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/refBrand/${id}`);
      
      // Update local state
      setRefBrandData(prev => prev.filter(item => item.id != id));
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete BrandName';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh brands
  const refreshRefBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/refBrand');    
      setRefBrandData(response.data);

    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    refBrandData,
    loading,
    error,
    actionLoading,
    createrefBrand,
    updaterefBrand,
    deleterefBrand,
    refreshRefBrand,
    testAPI
  };
};




