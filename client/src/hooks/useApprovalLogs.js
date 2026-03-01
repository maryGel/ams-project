import {useState, useEffect} from 'react';
import {api} from '../api/axios';

export const useApprovalLogs = () => {
    const [approvalLogs, setApprovalLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const getApprovalLogs = async() => {
            try {
              setIsLoading(true);
              setError(null)

              const response = await api.get('/appLogsRoute');
              const data = response.data;
              
              setApprovalLogs(data);


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
        getApprovalLogs()

    }, []);

    return {
      approvalLogs,
      isLoading,
      error
    }
};