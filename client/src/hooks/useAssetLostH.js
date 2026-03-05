import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useAssetLostH = () => {
    const [assetLostHeaders, setAssetLostHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All JO Headers
    useEffect(()=> {
        const getAssetLostHeaders = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/assetLostHRoute');
              const data = response.data;
              
              setAssetLostHeaders(data);


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
        };
        getAssetLostHeaders()

    }, []);

    return {
      assetLostHeaders,
      isLoading,
      error
    }
};