import {useState, useEffect} from 'react';
import { api } from '../api/axios'


export const useSections= () => {
  const [refSections, setRefSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);


  // GET all Sections
  useEffect(() => {
    const getRefSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/secRoutes');       
        const data = response.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array but got: ' + typeof data);
        }
        
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `temp-${index}`,
          xcode: item.xcode,
          xdesc: item.xdesc
        }));
        
        setRefSections(dataWithID);
        
      } catch (error) {
        setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    getRefSections();
  }, []);

  // Create xdesc 
  const createSection = async (xcode ='', xdesc ) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await api.post('/secRoutes', { xcode, xdesc });
      
      const created = {
        id: response.data.id,
        xcode: response.data.xcode,
        xdesc: response.data.xdesc
      }

      setRefSections(prev => [...prev, created]);      
      return created;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create xdesc';
      setError(errorMsg);
      throw new Error(errorMsg);

    } finally {
      setActionLoading(false);
    }
  };

  // Update xdesc - UPDATED TO SEND CORRECT FIELDS
  const updateSection = async (id,  xcode = '', xdesc) => {
    try {
      setActionLoading(true);
      
      const response = await api.put(`/secRoutes/${id}`, { xcode, xdesc });
      
      // Update local state
      setRefSections(prev => 
        prev.map(item => 
          item.id == id ? { ...item, xcode, xdesc} : item
        )
      );
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update xdesc';
      setError(errorMsg);
      throw new Error(errorMsg);    
    } finally {
      setActionLoading(false);
    }
  };

  // Delete xdesc
  const deleteSection = async (id) => {
    try {
      setActionLoading(true);
      
      const response = await api.delete(`/secRoutes/${id}`);
      
      // Update local state
      setRefSections(prev => prev.filter(item => item.id != id));
      
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete xdesc';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Refresh brands
  const refreshRefSections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/secRoutes');    
      setRefSections(response.data);

    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to fetch brands');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    refSections,
    loading,
    error,
    actionLoading,
    createSection,
    updateSection,
    deleteSection,
    refreshRefSections,
  };
};




