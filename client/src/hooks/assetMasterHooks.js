import {useState, useEffect } from 'react';
import axios from 'axios';


export const useAssetMasterData = () => {
  const [itemList, setItemList] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(()=> {
    const fetchItems = async () => {
      try{
        const response = await axios.get('/api/itemlist/assetMasterlist');

        const data = response.data;

        const dataWithID = data.map((item, index) => ({
          ...item,
          id: item.FacN0 || `row-${index}`
        })) 
        setItemList(dataWithID);

      } catch(error) {
        console.log(error)
      } finally {
        setLoading(false);
        setError(null);
      }
    };
    fetchItems()
  },[])

  return {itemList, loading, error}

}

