import { useState } from 'react';

export function useEditableTable(initialData = []){
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [originalRow, setOriginalRow] = useState(null);

  const syncData = (newData) => {
    setData(newData);
  };

  const addRow = (row) => {
    setData(prev => [...prev, row]);
    setEditingRowId(row.id);
    setOriginalRow(null);
  };

  const startEdit = (row) => {
    setEditingRowId(row.id);
    setOriginalRow(row.id);
  };

  const updateCell = (id, field, value) => {
    setData(prev => prev.map(r => r.id === id ? {...r, [field]: value} : r));
  }

  const cancelEdit = () => {
    if (originalRow) {
      setData(prev => prev.map(r => r.id === originalRow.id ? originalRow : r))
    } else {
      setData(prev => prev.filter(r => !r.isNew));
    }
    setEditingRowId(null);
    setOriginalRow(null);
  }

  const editedRow = data.find(r => r.id === editingRowId);

  return {
    data,
    syncData,
    setData,
    editingRowId,
    editedRow,
    addRow,
    startEdit,
    updateCell,
    cancelEdit
  };
};

