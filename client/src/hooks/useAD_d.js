import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useAD_d = () => {
    const [adDetails, setAdDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All AD Details
    useEffect(()=> {
        const getADDetails = async() => {
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
        };
        getADDetails()

    }, []);

    return {
      adDetails,
      isLoading,
      error
    }
};