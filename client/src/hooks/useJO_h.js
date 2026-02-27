import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useJO_h = () => {
    const [joHeaders, setJoHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All JO Headers
    useEffect(()=> {
        const getJOHeaders = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/jo_hRoute');
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
        };
        getJOHeaders()

    }, []);

    return {
      joHeaders,
      isLoading,
      error
    }
};