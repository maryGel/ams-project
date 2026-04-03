import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useJO_h = () => {
    const [joHeaders, setJoHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getJOHeaders = useCallback(async () => {
      try {
            setIsLoading(true);
            setError(null)

            const response = await api.get('/jo_hRoute', {
                params: { _: Date.now() } // prevent caching
            });
            
            const data = response.data;
            
            setJoHeaders(data);


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
      getJOHeaders();
    }, [getJOHeaders]);

    return {
      joHeaders,
      isLoading,
      error,
      joRefresh : getJOHeaders
    }
};