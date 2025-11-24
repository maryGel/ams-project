// hooks/refItemClassegory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const useRefItemClass = () => {
  const [refItemClassData, setRefItemClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Test API connection
  const testAPI = async () => {
    try {
      const response = await api.get('/refItemClass/test');
      console.log('API Test Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  };

  // GET all categories
  useEffect(() => {
    const getRefItemClass = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API first
        await testAPI();
        
        // Then fetch categories
        console.log('Fetching categories...');
        const response = await api.get('/refItemClass');
        console.log('Item Class response:', response.data);
        
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          classCode: item.classCode || item.code || `CODE-${item.id || index}`,
          itemClass: item.itemClass || item.name || 'Unnamed Item Class',
          category: item.category || item.category || 'Unnamed Item Class'
        }));
        
        setRefItemClassData(dataWithID);
        
      } catch (error) {
        console.error('Error in getRefItemClass:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    
    getRefItemClass();
  }, []);

  // Create itemClass - UPDATED TO SEND CORRECT FIELDS
  const createRefItemClass = async (classCode = '', itemClass, category) => {
    try {
      setActionLoading(true);
      console.log('Creating itemClass:', {itemClass, classCode, category});
      
      const response = await api.post('/refItemClass', { itemClass, classCode, category });
      console.log('Create response:', response.data);
      
      // Refresh the list
      await refreshItemClasses();
      
      return response.data;
    } catch (error) {
      console.error('Error creating itemClass:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Update itemClass - UPDATED TO SEND CORRECT FIELDS
  const updateRefItemClass = async (id, classCode = '', itemClass, category) => {
    try {
      setActionLoading(true);
      console.log(`Updating itemClass ${id} to:`, { classCode, itemClass, category });
      
      const response = await api.put(`/refItemClass/${id}`, { classCode, itemClass, category });
      console.log('Update response:', response.data);
      
      // Update local state
      setRefItemClassData(prev => 
        prev.map(item => 
          item.id == id ? { ...item, classCode, itemClass, category} : item
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating itemClass:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete itemClass
  const deleteRefItemClass = async (id) => {
    try {
      setActionLoading(true);
      console.log('Deleting itemClass:', id);
      
      const response = await api.delete(`/api/refItemClass/${id}`);
      console.log('Delete response:', response.data);
      
      // Update local state
      setRefItemClassData(prev => prev.filter(item => item.id != id));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting itemClass:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete itemClass';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh categories
  const refreshItemClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/refItemClass');
      const data = response.data;
      
      const dataWithID = data.map((item, index) => ({
        ...item,
        id: item.id || `temp-${index}`,
        classCode: item.classCode || item.code || `CODE-${item.id || index}`,
        itemClass: item.itemClass || item.name || 'Unnamed itemClass',
        category: item.category || ''
      }));
      
      setRefItemClassData(dataWithID);
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

