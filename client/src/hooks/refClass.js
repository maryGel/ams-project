// hooks/refItemClassegory.js
import { useState, useEffect } from 'react';
import { api } from '../api/axios'


export const useRefItemClass = () => {
  const [refItemClassData, setRefItemClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Test API connection
  const testAPI = async () => {
    try {
      const response = await api.get('/refItemClass/test');
      return response.data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  };

  // GET all AssetClasses
  useEffect(() => {
    const getRefItemClass = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API first
        await testAPI();
        
        const response = await api.get('/refItemClass');       
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          classCode: item.classCode,
          itemClass: item.itemClass,
          category: item.category
        }));
        
        setRefItemClassData(dataWithID);
        
      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch AssetClasses');

      } finally {
        setLoading(false);
      }
    };
    
    getRefItemClass();
  }, []);

  // Create asset class
  const createRefItemClass = async (classCode = '', itemClass, category) => {
    try {
      setActionLoading(true);
      setError(null)

      const response = await api.post('/refItemClass', { itemClass, classCode, category });

      const created = {
        id: response.data.id,
        itemClass: response.data.itemClass,
        classCode: response.data.classCode,
        category: response.data.category
      }
      
      setRefItemClassData(prev => [...prev, created]);           
      return created;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);
      
    } finally {
      setActionLoading(false);
    }
  };

  // Update asset class
  const updateRefItemClass = async (id, classCode = '', itemClass, category) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await api.put(`/refItemClass/${id}`, { classCode, itemClass, category });
      
      // Update local state
      setRefItemClassData(prev => 
        prev.map(item => item.id == id ? { ...item, classCode, itemClass, category} : item)
      );
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);

    } finally {
      setActionLoading(false);
    }
  };

  // Delete asset class
  const deleteRefItemClass = async (id) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/refItemClass/${id}`);
      
      // Update local state
      setRefItemClassData(prev => prev.filter(item => item.id != id));
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);

    } finally {
      setActionLoading(false);
    }
  };

  // Refresh AssetClasses
  const refreshItemClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/refItemClass');
      setRefItemClassData(response.data);
      
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to fetch AssetClasses');
      throw error;

    } finally {
      setLoading(false);
    }
  };

  return {
    refItemClassData,
    loading,
    error,
    actionLoading,
    createRefItemClass,
    updateRefItemClass,
    deleteRefItemClass,
    refreshItemClasses,
    testAPI
  };
};

