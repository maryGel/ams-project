import { useEffect, useReducer, useCallback } from 'react';
import { api } from '../api/axios'


const initialState = {
  assets: [],
  singleAsset: null,
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
    
    case 'LOADING_SINGLE':
       return {...state, status: 'loadingSingle', error: 'null'}

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

    case 'SET_SINGLE_ASSET':
      return {
        ...state,
        singleAsset: action.payload,
        status: 'idle',
        error: null
      }

    case 'CLEAR_SINGLE_ASSET':
       return {
        ...state,
        singleAsset: null,
        state: 'idle',
        error: null
       }
    
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


  // ... Get all the itemlist (asset master data) ...

  const fetchAssets = useCallback(async (page = state.page) => {
    try{
      dispatch({type: 'LOADING'});

      const res = await api.get('/itemlist/assetMasterlist', {
          params: { page: page + 1, pageSize: state.pageSize }
      });
      
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
  }, [state.page, state.pageSize]); 

  useEffect(() => {
    console.log('useEffect running - fetchAssets triggered');
    fetchAssets();
  },[fetchAssets])


  // ... Get single asset by FacN0 ...

  const fetchAssetByFacN0 = useCallback( async(facNo) => {
    try {
      if (!facNo) {
        dispatch({type: 'CLEAR_SINGLE_ASSET'});
        return null;
      }

      dispatch({type: 'LOADING_SINGLE'});

      const cleanFacNo = facNo.replace(/\s/g,'').toUpperCase(); // Clean the facNo for API call
      const res = await api.get(`/itemlist/assetMasterlist/${cleanFacNo}`)
      console.log(`cleanFacN0: ${cleanFacNo}`)
      dispatch({
        type: 'SET_SINGLE_ASSET',
        payload: res.data
      });
      return res.data;

    } catch (error) { 
      dispatch({
        type: 'ERROR',
        payload: error.response?.data?.error || error.message,
      });
      throw error;
    }
  }, []);

  const clearSingleAsset = useCallback(() => {
    dispatch({ type: 'CLEAR_SINGLE_ASSET'});
  },[]);

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
    singleAsset: state.singleAsset,
    total: state.total,
    page: state.page,
    pageSize: state.pageSize,
    selectedAsset: state.selectedAsset,

    status: state.status,
    error: state.error,

    isLoading: state.status === 'loading',
    isMutating: state.status === 'mutating',
    isLoadingSingle: state.status === 'loadingSingle',

    setPage: page => dispatch({ type: 'SET_PAGE', payload: page }),
    selectAsset: asset => dispatch({ type: 'SELECT_ASSET', payload: asset }),

    // Data fetching
    fetchAssets,
    fetchAssetByFacN0,
    clearSingleAsset,
    
    // CRUD operations
    createAsset,
    updateAsset,
    deleteAsset,
  };
};

