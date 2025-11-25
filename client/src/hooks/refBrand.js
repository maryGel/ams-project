import {useState, useEffect} from 'react';
import axios from 'axios';



// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const useRefBrand = () => {
  const [refBrandData, setRefBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Test API connection
  const testAPI = async () => {
    try {
      const response = await api.get('/refBrand/test');
      console.log('API Test Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  };

  // GET all categories
  useEffect(() => {
    const getRefBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API first
        await testAPI();
        
        // Then fetch categories
        console.log('Fetching categories...');
        const response = await api.get('/refBrand');
        console.log('Categories response:', response.data);
        
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          BrandID: item.BrandID || item.code || `CODE-${item.id || index}`,
          BrandName: item.BrandName || item.name || 'BrandName'
        }));
        
        setRefBrandData(dataWithID);
        
      } catch (error) {
        console.error('Error in getRefBrand:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
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
      console.log('Creating BrandName:', { BrandID, BrandName });
      
      const response = await api.post('/refBrand', { BrandID, BrandName });
      console.log('Create response:', response.data);
      
      // Refresh the list
      await refreshRefBRand();
      
      return response.data;
    } catch (error) {
      console.error('Error creating BrandName:', error);
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
      console.log(`Updating BrandName ${id} to:`, { BrandID, BrandName });
      
      const response = await api.put(`/refBrand/${id}`, { BrandID, BrandName });
      console.log('Update response:', response.data);
      
      // Update local state
      setRefBrandData(prev => 
        prev.map(item => 
          item.id == id ? { ...item, BrandID, BrandName} : item
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating BrandName:', error);
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
      console.log('Deleting BrandName:', id);
      
      const response = await api.delete(`/refBrand/${id}`);
      console.log('Delete response:', response.data);
      
      // Update local state
      setRefBrandData(prev => prev.filter(item => item.id != id));
      
      return response.data;
    } catch (error) {
      console.error('Error deleting BrandName:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete BrandName';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh categories
  const refreshRefBRand = async () => {
    try {
      setLoading(true);
      const response = await api.get('/refBrand');
      const data = response.data;
      
      const dataWithID = data.map((item, index) => ({
        ...item,
        id: item.id || `temp-${index}`,
        BrandID: item.BrandID || item.code || `CODE-${item.id || index}`,
        BrandName: item.BrandName || item.name || 'Unnamed BrandName'
      }));
      
      setRefBrandData(dataWithID);
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
    refBrandData,
    loading,
    error,
    actionLoading,
    createrefBrand,
    updaterefBrand,
    deleterefBrand,
    refreshRefBRand,
    testAPI
  };
};



// export const useRefBrand = () => {
  
//   const [refBrandData, setRefBrandData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(()=>{

//     const getRefBrand = async () => {
//       try{
//         const response = await axios.get('/api/referentials/refBrand');
//         const data = response.data;
//         const dataWithID = data.map((item, index) => ({
//           ...item,
//           id: item.id || {index}
//         }))
//         setRefBrandData(dataWithID);
//       } catch(error) {
//         console.log(error)
//       } finally {
//         setLoading(false)
//         setError(null)
//       }
//     }
//     getRefBrand()
//   },[]);
//   return {refBrandData, loading, error}
// }


