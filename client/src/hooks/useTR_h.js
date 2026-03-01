import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useTR_h = () => {
    const [trHeaders, setTrHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All TR Headers
    useEffect(()=> {
        const getTRHeaders = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/tr_hRoute');
              const data = response.data;
              
              setTrHeaders(data);


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
        };
        getTRHeaders()

    }, []);

    return {
      trHeaders,
      isLoading,
      error
    }
};