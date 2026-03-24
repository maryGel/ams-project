// mvJobOrdersPage.jsx
import { useState, useEffect } from 'react';
// MUI
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
;
import CloseIcon from '@mui/icons-material/Close';


// Search Overlay Component
export const SearchOverlay = ({ isOpen, onClose, joHeaders, onSelectJO }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Filter JO headers by JO number
    const results = joHeaders.filter((jo) => {
      const joNumber = jo.JO_No  || '';
      return joNumber.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    setSearchResults(results);
  }, [searchTerm, joHeaders]);

  const handleSelectJO = (jo) => {
    onSelectJO(jo);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 mt-20 bg-white rounded-lg shadow-xl animate-slide-down">
        {/* Search Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Search Job Order</h3>
          <button
            onClick={handleClose}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Enter JO number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-600">
                Found {searchResults.length} result(s)
              </div>
              <div className="overflow-y-auto max-h-96">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.ID || result.JO_No}
                        onClick={() => handleSelectJO(result)}
                        className="p-3 transition-colors border rounded-lg cursor-pointer hover:bg-blue-50"
                      >
                        <div className="font-semibold text-blue-600">
                          {result.JO_No}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {result.Department_Code || result.department}
                        </div>
                        {result.Remarks && (
                          <div className="mt-1 text-xs text-gray-500">
                            Remarks: {result.Remarks}
                          </div>
                        )}
                        {result.requested_by && (
                          <div className="mt-1 text-xs text-gray-500">
                            Requestor: {result.requested_by}
                          </div>
                        )}
                        {result.xDate && (
                          <div className="mt-1 text-xs text-gray-500">
                            Date: {new Date(result.xDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No matching JO numbers found
                  </div>
                )}
              </div>
            </div>
          )}

          {!searchTerm && (
            <div className="py-8 text-center text-gray-400">
              <SearchIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <p className="mt-2">Start typing a JO number to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
