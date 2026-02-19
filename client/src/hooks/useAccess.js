import { useState, useEffect } from 'react';
import { api } from '../api/axios';

function transformAccessData(apiData, userId) {
  if (!apiData || !Array.isArray(apiData)) {
    console.log('No data or not an array:', apiData);
    return [];
  }
  
  console.log('All permissions:', apiData);
  console.log('Filtering for userId:', userId);
  
  // Filter items by G_CODE matching the userId
  const userPermissions = apiData.filter(item => item.G_CODE === userId);
  
  console.log(`Filtered permissions for user ${userId}:`, userPermissions.length);
  
  if (userPermissions.length === 0) {
    console.log('No permissions found for this user');
    return [];
  }
  
  // Separate parents (U_MAIN === 1) and children (U_MAIN === 0)
  const parents = userPermissions.filter(item => item.U_MAIN === 1);
  const children = userPermissions.filter(item => item.U_MAIN === 0);
  
  console.log('Parents found:', parents.length);
  console.log('Children found:', children.length);
  
  // Group children by MAIN_CODE
  const childrenByMainCode = {};
  children.forEach(child => {
    const mainCode = child.MAIN_CODE;
    if (!childrenByMainCode[mainCode]) {
      childrenByMainCode[mainCode] = [];
    }
    childrenByMainCode[mainCode].push({
      id: child.U_CODE,
      label: child.U_PERM,
      U_CODE: child.U_CODE,
      U_PERM: child.U_PERM,
      MAIN_CODE: child.MAIN_CODE,
      originalData: child
    });
  });
  
  // Create parent items with their children
  const transformed = parents.map(parent => {
    const parentChildren = childrenByMainCode[parent.MAIN_CODE] || [];
    
    return {
      id: parent.MAIN_CODE,
      label: parent.U_PERM,
      U_CODE: parent.U_CODE,
      U_PERM: parent.U_PERM,
      MAIN_CODE: parent.MAIN_CODE,
      originalData: parent,
      children: parentChildren
    };
  });
  
  console.log('Transformed data:', transformed);
  return transformed;
}

export const useAccess = (userId) => {
    const [accessData, setAccessData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAccessRights = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('Fetching access rights for user:', userId);
                
                const response = await api.get('/accessRights');
                console.log('API Response:', response);
                
                const data = response.data;
                console.log('Response data:', data);

                if (!Array.isArray(data)) {
                    console.log('Data is not an array:', data);
                    throw new Error('Expected array but got: ' + typeof data);
                }

                // Transform data for specific user
                const transformedData = transformAccessData(data, userId);
                setAccessData(transformedData);

            } catch (err) {
                console.error('Error in useAccess:', err);
                setError(err.response?.data?.error || err.message || 'Failed to fetch user_permissions');
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            getAccessRights();
        } else {
            setLoading(false);
            setAccessData([]);
        }
    }, [userId]);

    return { 
        accessData, 
        loading, 
        error 
    };
};