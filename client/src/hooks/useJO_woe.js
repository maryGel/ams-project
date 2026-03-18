import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useJO_woe = () => {
    const [joWorkOrders, setJoWorkOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get All JO Work Orders
    useEffect(()=> {
        const getJOWorkOrders = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/jo_woeRoute');
              const data = response.data;
              
              setJoWorkOrders(data);


            } catch (error) {
              console.error('Error details:', {
                    message: error.message,
                    response: error.response,
                    config: error.config
                });
                
                setError(
                    error.response?.data?.error || 
                    error.message || 
                    'Failed to fetch JO work Orders'
                );
            } finally {
              setIsLoading(false);
            }
        };
        getJOWorkOrders()

    }, []);

    return {
      joWorkOrders,
      isLoading,
      error
    }
};