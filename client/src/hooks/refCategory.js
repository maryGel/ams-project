// hooks/refCategory.js
import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const useRefCategory = () => {
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

  // GET all categories
  useEffect(() => {
    const getRefCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API first
        await testAPI();
        
        // Then fetch categories
        console.log('Fetching categories...');
        const response = await api.get('/api/refCat');
        console.log('Categories response:', response.data);
        
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          xCode: item.xCode || item.code || `CODE-${item.id || index}`,
          category: item.category || item.name || 'Unnamed Category'
        }));
        
        setRefCategoryData(dataWithID);
        
      } catch (error) {
        console.error('Error in getRefCategory:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    
    getRefCategory();
  }, []);

  // Create category - UPDATED TO SEND CORRECT FIELDS
  const createRefCategory = async (xCode = '', category) => {
    try {
      setActionLoading(true);
      console.log('Creating category:', { xCode, category });
      
      const response = await api.post('/api/refCat', { xCode, category});
      console.log('Create response:', response.data);
      
      // Refresh the list
      await fetchRefCategories();
      
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create category';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Update category - UPDATED TO SEND CORRECT FIELDS
  const updateRefCategory = async (id, xCode = '', category) => {
    try {
      setActionLoading(true);
      console.log(`Updating category ${id} to:`, { xCode, category });
      
      const response = await api.put(`/api/refCat/${id}`, { xCode, category });
      console.log('Update response:', response.data);
      
      // Update local state
      setRefCategoryData(prev => 
        prev.map(item => 
          item.id == id ? { ...item, xCode, category} : item
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
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
      console.log('Deleting category:', id);
      
      const response = await api.delete(`/api/refCat/${id}`);
      console.log('Delete response:', response.data);
      
      // Update local state
      setRefCategoryData(prev => prev.filter(item => item.id != id));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete category';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh categories
  const fetchRefCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/refCat');
      const data = response.data;
      
      const dataWithID = data.map((item, index) => ({
        ...item,
        id: item.id || `temp-${index}`,
        xCode: item.xCode || item.code || `CODE-${item.id || index}`,
        category: item.category || item.name || 'Unnamed Category'
      }));
      
      setRefCategoryData(dataWithID);
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

// import {useState, useEffect} from 'react';
// import axios from 'axios';

// export const useRefCategory = () => {

//   const [refCategoryData, setRefCategoryData] = useState([])
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {

//     const getRefCategory = async() => {
//       try{
//         const response = await axios.get('/api/referentials/refCategory');
//         const data = response.data;
//         const dataWithID = data.map((item, index) => ({
//           ...item,
//           id: item.id || {index}
//         }))
//         setRefCategoryData(dataWithID);
//       } catch(error) {
//         console.log(error)
//       } finally {
//         setLoading(false)
//         setError(null)
//       }
//     }
//     getRefCategory()
//   }, []);
//   return {refCategoryData, loading, error}
// }