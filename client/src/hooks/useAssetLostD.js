import {useState, useEffect, useCallback} from 'react';
import {api} from '../api/axios';

export const useAssetLostD = () => {
    const [assetLostDetails, setAssetLostDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAssetLostHeaders = useCallback(async() => {
       try {
          setIsLoading(true);
          setError(null)

          const response = await api.get('/assetLostDRoute');
          const data = response.data;
          
          setAssetLostDetails(data);


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
    }, []);


    useEffect(() => {
        getAssetLostHeaders();
    }, [getAssetLostHeaders]);

    return {
      assetLostDetails,
      isLoading,
      error,
      aLostDRefresh: getAssetLostHeaders
    }
};