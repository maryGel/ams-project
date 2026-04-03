import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';
import { use } from 'react';

export const useAD_d = () => {
    const [adDetails, setAdDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const getADDetails = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null)

        const response = await api.get('/ad_dRoute');
        const data = response.data;
        
        setAdDetails(data);


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
      getADDetails();
    }, [getADDetails]);

    return {
      adDetails,
      isLoading,
      error,
      adDRefresh : getADDetails
    }
};