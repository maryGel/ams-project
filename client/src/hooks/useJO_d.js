import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useJO_d = () => {
    const [joDetails, setJoDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All JO Headers
    useEffect(()=> {
        const getJODetails = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/jo_dRoute');
              const data = response.data;
              
              setJoDetails(data);


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
        getJODetails()

    }, []);

    return {
      joDetails,
      isLoading,
      error
    }
};