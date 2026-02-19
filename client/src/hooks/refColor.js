import {useState, useEffect} from 'react';
import { api } from '../api/axios'


export const useColors= () => {
  const [refColors, setRefColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);


  // GET all brands
  useEffect(() => {
    const getRefColors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/colorsRoute');       
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          ColID: item.ColID,
          ColName: item.ColName
        }));
        
        setRefColors(dataWithID);

        
      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    getRefColors();
  }, []);

  console.log(`refColor: ${refColors}`)

  // Create ColName 
  const createColor = async (ColID ='', ColName ) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await api.post('/colorsRoute', { ColID, ColName });
      
      const created = {
        id: response.data.id,
        ColID: response.data.ColID,
        ColName: response.data.ColName
      }

      setRefColors(prev => [...prev, created]);      
      return created;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create ColName';
      setError(errorMsg);
      throw new Error(errorMsg);

    } finally {
      setActionLoading(false);
    }
  };

  // Update ColName - UPDATED TO SEND CORRECT FIELDS
  const updateColor = async (id,  ColID = '', ColName) => {
    try {
      setActionLoading(true);
      
      const response = await api.put(`/colorsRoute/${id}`, { ColID, ColName });
      
      // Update local state
      setRefColors(prev => 
        prev.map(item => 
          item.id == id ? { ...item, ColID, ColName} : item
        )
      );
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update ColName';
      setError(errorMsg);
      throw new Error(errorMsg);    
    } finally {
      setActionLoading(false);
    }
  };

  // Delete ColName
  const deleteColor = async (id) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/colorsRoute/${id}`);
      
      // Update local state
      setRefColors(prev => prev.filter(item => item.id != id));
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete ColName';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh brands
  const refreshRefColors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/colorsRoute');    
      setRefColors(response.data);

    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    refColors,
    loading,
    error,
    actionLoading,
    createColor,
    updateColor,
    deleteColor,
    refreshRefColors,
  };
};




