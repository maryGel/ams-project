import {useState, useEffect} from 'react';
import axios from 'axios';

export const useRefCategory = () => {

  const [refCategoryData, setRefCategoryData] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getRefCategory = async() => {
      try{
        const response = await axios.get('/api/referentials/refCategory');
        const data = response.data;
        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.id || {index}
        }))
        setRefCategoryData(dataWithID);
      } catch(error) {
        console.log(error)
      } finally {
        setLoading(false)
        setError(null)
      }
    }
    getRefCategory()
  }, []);
  return {refCategoryData, loading, error}
}