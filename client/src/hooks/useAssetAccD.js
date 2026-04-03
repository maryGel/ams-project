import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useAssetAccD = () => {
    const [assetAccDetails, setAssetAccDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const getAAcctDetails = useCallback(async() => {
      try {
        setIsLoading(true);
        setError(null)

        const response = await api.get('/assetaccdRoute');
        const data = response.data;
        
        setAssetAccDetails(data);


      } catch (error) {
        console.error('Error details:', {
              message: error.message,
              response: error.response,
              config: error.config
          });
          
          setError(
              error.response?.data?.error || 
              error.message || 
              'Failed to fetch Asset Account Details'
          );
      } finally {
        setIsLoading(false);
      }
    } , []);

    useEffect(() => {
      getAAcctDetails();
    }, [getAAcctDetails]);

    return {
      assetAccDetails,
      isLoading,
      error,
      accDRefresh: getAAcctDetails 
    }
};