import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useAssetAccH = () => {
    const [assetAccHeaders, setAssetAccHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAAcctHeaders = useCallback(async() => {
      try {
        setIsLoading(true);
        setError(null)

        const response = await api.get('/assetacchRoute');
        const data = response.data;
        
        setAssetAccHeaders(data);


      } catch (error) {
        console.error('Error details:', {
              message: error.message,
              response: error.response,
              config: error.config
          });
          
          setError(
              error.response?.data?.error || 
              error.message || 
              'Failed to fetch Asset Account headers'
          );
      } finally {
        setIsLoading(false);
      }
    } , []);

    useEffect(() => {
      getAAcctHeaders();
    }, [getAAcctHeaders]);

    return {
      assetAccHeaders,
      isLoading,
      error,
      accHRefresh: getAAcctHeaders
    }
};