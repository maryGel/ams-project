import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useAD_h = () => {
    const [adHeaders, setAdHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getADHeaders = useCallback(async () => {
       try {
        setIsLoading(true);
        setError(null)

        const response = await api.get('/ad_hRoute');
        const data = response.data;
        
        setAdHeaders(data);


      } catch (error) {
        console.error('Error details:', {
              message: error.message,
              response: error.response,
              config: error.config
          });
          
          setError(
              error.response?.data?.error || 
              error.message || 
              'Failed to fetch JO headers'
          );
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      getADHeaders();
    }, [getADHeaders]);

    return {
      adHeaders,
      isLoading,
      error,
      adHRefresh : getADHeaders
    }
};