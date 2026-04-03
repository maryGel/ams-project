import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useTR_d = () => {
    const [trDetails, setTrDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getTRDetails = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null)

        const response = await api.get('/tr_dRoute');
        const data = response.data;
        
        setTrDetails(data);
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
      getTRDetails();
    }, [getTRDetails]);

    return {
      trDetails,
      isLoading,
      error,
      trDRefresh : getTRDetails
    }
};