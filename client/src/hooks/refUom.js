import {useState, useEffect} from 'react';
import { api } from '../api/axios'

export const useRefUom = () => {
  
  const [uomData, setUomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

 
    // GET all UOMS
    useEffect(() => {
      const getrefUnit = async () => {
        try {
          setLoading(true);
          setError(null);
         
          const response = await api.get('/api/refUnit');         
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
          setError(error.response?.data?.error || error.message || 'Failed to fetch categories');
        } finally {
          setLoading(false);
        }
      };
      
      getrefUnit();
    }, []);
  
    // Create Unit 
    const createRefUnit = async (Unit ='') => {
      try {
        setActionLoading(true);
        setError(null);
        
        const response = await api.post('/api/refUnit', { Unit });
        
        const created = {
          id: response.data.id,
          Unit: response.data.Unit
        };
        
        setUomData(prev => [...prev, created]);
        return created;
      
      } catch (error) {
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
        
        const response = await api.put(`/api/refUnit/${id}`, { Unit });
        
        // Update local state
        setUomData(prev => 
          prev.map(item => 
            item.id == id ? { ...item, Unit} : item
          )
        );
        
        return response.data;

      } catch (error) {
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
        
        const response = await api.delete(`/api/refUnit/${id}`);
        
        // Update local state
        setUomData(prev => prev.filter(item => item.id != id));
        
        return response.data;
        
      } catch (error) {
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
        setError(null);
        
        const response = await api.get('/api/refUnit');     
        setUomData(response.data);

      } catch (error) {
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
  }
}