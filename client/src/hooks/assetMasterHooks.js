import { useEffect, useReducer } from 'react';
import { api } from '../api/axios'


const initialState = {
  assets: [],
  status: 'idle', // loading | mutating | error
  error: null,

  displayedAssets: [],
  filters: {},

  page: 0,
  pageSize: 5,
  rowsPerPage: 5,
  total: 0,

};

function assetReducer(state, action) {
  switch (action.type) {
    
    case 'LOADING':
      return {...state, status: 'loading', error: 'null'};
    
    case 'MUTATING':
      return {...state, status: 'mutating', error: 'null'};
    
    case 'ERROR':
      return {...state, status: 'error', error: action.payload};
    
    case 'SUCCESS':
      return {...state, status: 'idle'};
  
    case 'SET_DATA':
      return {
        ...state,
        assets: action.payload.data || [],
        displayedAssets: action.payload.data || [],
        total: action.payload.total || 0,
        status: 'idle',
        error: null
      };
    
    case 'ADD_ASSET':
      return {
        ...state,
        assets: [action.payload, ...state.assets],
        total: state.total + 1,
      }
    
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map( a => a.id !== action.payload),
        total: state.total - 1,
      }
    
    case 'SELECT_ASSET':
      return { ... state, selectedAsset: action.payload};

    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload
      };
    
    default:
      return state;
  }
}

export const useAssetMasterData = () => {

  const [state, dispatch] = useReducer(assetReducer, initialState);


  // Get all the itemlist (asset master data)

  const fetchAssets = async (page = state.page) => {
    try{
      dispatch({type: 'LOADING'});

      const res = await api.get('/itemlist/assetMasterlist', {
          params: { page: page + 1, pageSize: state.pageSize }
      });
      
      console.log('=== FULL API RESPONSE ===');
      console.log('Response:', res);
      console.log('Response data:', res.data);
      console.log('Data structure:', typeof res.data);

      dispatch({
        type: 'SET_DATA',
        payload: {
          data: res.data,
          total: res.data.length
        }
      })

      dispatch({ type: 'SUCCESS'});  

    } catch (error) {
      dispatch ({
        type: 'ERROR',
        payload: error.response?.data?.error || error.message,
      });
    } 
  }

  useEffect(() => {
    fetchAssets();
  },[state.page])

  
  // ... Create ...

  const createAsset = async(payload) => {
    try{
      dispatch({type: 'MUTATING'});
      
      const res = await api.post('/itemlist/createAsset', payload)
      dispatch({
        type: 'ADD_ASSET',
        payload: { id: res.data.assetID, ...payload},
      });

      dispatch({ type: 'SUCCESS'})

    } catch (error) {
      dispatch ({
        type: 'ERROR',
        payload: error.response?.data?.error || error.message,
      });
      throw error;
    } 
  };

  
  // ... Update ...

  const updateAsset = async(payload) => {
    try{
      dispatch({ type: 'MUTATING'});

      const res = await api.put(`/itemlist/updateAsset/${id}`, payload);
      dispatch({
        type: 'UPDATE_ASSET',
        payload: { id, ...payload}
      })

      dispatch({ type: 'SUCCESS'});

    } catch (error) {
      dispatch ({
        type: 'ERROR',
        payload: error.response?.data?.error || error.message,
      });
      throw error;

    }
  }

    const deleteAsset = async (id) => {
    try {
      dispatch({ type: 'MUTATING' });

      await api.delete(`/deleteAsset/${id}`);

      dispatch({ type: 'REMOVE_ASSET', payload: id });
      dispatch({ type: 'SUCCESS' });

    } catch (err) {
      dispatch({
        type: 'ERROR',
        payload: err.response?.data?.error || err.message,
      });
      throw err;
    }
  }; 

  return {
    assets: state.assets,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    selectedAsset: state.selectedAsset,

    status: state.status,
    error: state.error,

    isLoading: state.status === 'loading',
    isMutating: state.status === 'mutating',

    setPage: page => dispatch({ type: 'SET_PAGE', payload: page }),
    selectAsset: asset => dispatch({ type: 'SELECT_ASSET', payload: asset }),

    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
};

