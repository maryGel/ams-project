import {useState, useEffect} from 'react';
import axios from 'axios';

export const useRefBrand = () => {
  
  const [refBrandData, setRefBrandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{

    const getRefBrand = async () => {
      try{
        const response = await axios.get('/api/referentials/refBrand');
        const data = response.data;
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || {index}
        }))
        setRefBrandData(dataWithID);
      } catch(error) {
        console.log(error)
      } finally {
        setLoading(false)
        setError(null)
      }
    }
    getRefBrand()
  },[]);
  return {refBrandData, loading, error}
}


