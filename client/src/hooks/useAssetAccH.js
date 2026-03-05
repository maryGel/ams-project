import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useAssetAccH = () => {
    const [assetAccHeaders, setAssetAccHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All JO Headers
    useEffect(()=> {
        const getAAcctHeaders = async() => {
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
        };
        getAAcctHeaders()

    }, []);

    return {
      assetAccHeaders,
      isLoading,
      error
    }
};