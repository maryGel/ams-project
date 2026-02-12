import { useEffect, useReducer, useCallback } from 'react';
import { api } from '../api/axios'

const initialState = {
    users: [],
    selectedUser: null,
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    search: '',
    loading: false,
    saving: false,
    error: null,
};

function usersReducer(state, action){
    switch (action.type) {
        case 'START':
            return {...state, loading: true, error: null}
        case 'SUCCESS':
            const total = Number(action.payload.total || 0);
            const totalPages = Math.max(1, Math.ceil(total / state.limit));
            return {
                ...state,
                users: action.payload.results || [],
                total,
                totalPages,              
                loading: false,                
            }
        case 'ERROR':
            return {...state, loading: false, saving: false, error: action.payload};
        case 'SAVE_START':
            return {...state, saving: true, error: null}
        case 'SAVE_END':
            return {...state, saving: false}
        case 'SET_PAGE':
            return {...state, page: action.payload};
        case 'SET_SEARCH':
            return {...state, search: action.payload, page: 1};
        case 'SET_SELECTED_USER':
            return {...state, selectedUser: action.payload};
        
        default:
            return state;        
    }
}

export const useUsers = () => {
    const [state, dispatch] = useReducer(usersReducer, initialState);

    // ... Get all users 
    const fetchUsers = useCallback(async (pageNum = state.page, searchText = state.search ) => {
        dispatch({ type: 'START'})
        try {
            const res = await api.get(`/users`, {
                params: { page: pageNum, limit: state.limit, q: searchText},
                withCredentials: true 
            });
            
            const data = await res.json();
            if(!res.data) throw new Error(data.error || 'Failed to fetch users');
            
            dispatch({ type: 'SUCCESS', payload: data}) // expects { results, total }

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message || 'Failed to fetch users'});
        };
    },[state.page, state.search, state.limit]);

    // Get user 
    const getUser = useCallback(async ( username ) => {
        dispatch({ type: 'START'})
        try {
            const res = await api.get(`/users/${encodeURIComponent(username)}`, 
                    { withCredentials: true }
            );
            
            const data = await res.json();
            if(!res.data) throw new Error(data.error || 'Failed to fetch user');
            
            dispatch({ type: 'SET_SELECTED_USER', payload: data});
            dispatch({ type: 'SAVE_START'});
            dispatch({ type: 'SUCCESS', payload: { results: state.users, total: state.total} });
            return data;

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message || 'Failed to fetch user'});
            return null;
        };
    },[state.users, state.total]);

    // ... Create user
    const createUser= useCallback(async ( payload ) => {
        dispatch({ type: 'SAVE_START'})
        try {
            const res = await api.post('/users', payload, {
                headers: { 'Content-Type' : 'application/json'},
                withCredentials: true,
            });
            
            const data = await res.json();
            if(!res.data) throw new Error(data.error || 'Failed to save user');
            
            await fetchUsers(1, state.search)
            dispatch({ type: 'SAVE_END'});
            
            return { ok: true, data: res.data};

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message || 'Failed to save user'});
            return { ok: false, error: err.message };
        };
    },[fetchUsers, state.search]);

    // ... Update user
    const updateUser= useCallback(async ( username, payload ) => {
        dispatch({ type: 'SAVE_START'})
        try {
            const res = await api.put(`/users/${encodeURIComponent(username)}`, payload, {
                headers: { 'Content-Type' : 'application/json'},
                withCredentials: true,
            });
            
            await fetchUsers(state.page, state.search);
            dispatch({ type: 'SAVE_END'});
            
            return { ok: true, data: res.data};

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message || 'Update error'});
            return { ok: false, error: err.message };
        };
    },[fetchUsers, state.page, state.search]);

    // Delete user 
        const deleteUser= useCallback(async ( username ) => {
        dispatch({ type: 'SAVE_START'})
        try {
            const res = await api.delete(`/users/${encodeURIComponent(username)}`, {
                withCredentials: true,              
            });            
            
            await fetchUsers(state.page, state.search)
            dispatch({ type: 'SAVE_END'});
            

        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message || 'Delete user'});
            throw err;
        };
    },[fetchUsers, state.page, state.search]);

    const setPage = (p) => dispatch({ type: 'SET_PAGE', payload: p });
    const setSearch = (q) => dispatch({ type: 'SET_SEARCH', payload: q });

    useEffect(() => {
        fetchUsers(state.page, state.search);
    }, [state.page, state.search, fetchUsers]);

    return {
        ...state,
        fetchUsers,
        getUser,
        createUser,
        updateUser,
        setPage,
        setSearch
    };
}