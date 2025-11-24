// hooks/refCategory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 1. UPDATED HOOK SIGNATURE
export const useRefCategory = (useProps, deps = []) => {
  const [refCategoryData, setRefCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Test API connection
  const testAPI = async () => {
    try {
      const response = await api.get('/api/refCat/test');
      console.log('API Test Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  };

  // Refresh categories (Centralized Fetching Logic)
  const fetchRefCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/refCat');
      const data = response.data;
      
      const dataWithID = data.map((item, index) => ({
        ...item,
        id: item.id || `temp-${index}`,
        xCode: item.xCode || item.code || `CODE-${item.id || index}`,
        category: item.category || item.name || 'Unnamed Category'
      }));
      
      setRefCategoryData(dataWithID);
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 2. ONLY ONE INITIAL/DEPENDENCY EFFECT (The new one)
  // This comment suppresses the necessary warning on 'deps'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const initialLoad = async () => {
        try {
            await testAPI(); 
            await fetchRefCategories(); 
        } catch (e) {
          // Errors logged/set inside testAPI/fetchRefCategories
          console.error("An error occurred during initial load sequence:", e);
        }
    };
    
    initialLoad();
    
  }, deps);

  // 3. CUD OPERATIONS (Updated to call fetchRefCategories instead of manual state updates)
  
  // Create category
  const createRefCategory = async (xCode = '', category) => {
    try {
      setActionLoading(true);
      const response = await api.post('/api/refCat', { xCode, category});
      await fetchRefCategories(); // Refresh the list
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create category';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Update category
  const updateRefCategory = async (id, xCode = '', category) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/api/refCat/${id}`, { xCode, category });
      await fetchRefCategories(); // Refresh the list (Safer than manual state update)
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update category';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete category
  const deleteRefCategory = async (id) => {
    try {
      setActionLoading(true);
      const response = await api.delete(`/api/refCat/${id}`);
      await fetchRefCategories(); // Refresh the list
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete category';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };


  return {
    refCategoryData,
    loading,
    error,
    actionLoading,
    createRefCategory,
    updateRefCategory,
    deleteRefCategory,
    fetchRefCategories,
    testAPI
  };
};