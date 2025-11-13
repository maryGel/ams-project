import {useState, useEffect} from 'react';
import axios from 'axios';


export const useRefUom = () => {
  
  const [uomData, setUomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getRefUom = async () => {
      try{
        const response = await axios.get('/api/referentials/refUnit');
        const data = response.data;
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || `row-${index}`
        })) 
        setUomData(dataWithID);       

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
        setError(null)
      }
    }
    getRefUom()
  }, [])

  return {uomData, loading, error}
}