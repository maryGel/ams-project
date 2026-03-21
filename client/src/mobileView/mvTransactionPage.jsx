import { useState, useMemo, useEffect } from 'react';

// MUI
import { 
  Button, CircularProgress, TextField, 
  Typography, Chip, Box, Paper,
  Autocomplete, createFilterOptions, Collapse, Alert, Snackbar,
  FormControl, InputLabel, Select, MenuItem, 
  
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';


// Hooks - Asset Master
import { useAssetMasterData } from '../hooks/assetMasterHooks';
import { useRefLocation } from '../hooks/refLocation';
import { useRefCategory } from '../hooks/refCategory';
import { useRefDepartment } from '../hooks/refDepartment';
import { useRefItemClass } from '../hooks/refClass';

// Custom Utils
import { CustomBtn } from '../Utils/groupbtns';
// Components
import AssetDetailPanel from './components/mvAssetDetailPanel';
import AssetCardItem from './components/mvAssetCardItem';


// Main Component
function MvTansactionPage({ setHeaderTitle, setNavLink }) {
  // Asset hook
  const {
    assets,
    isLoading,
    error,
    fetchAssetByFacN0,
    fetchAssets,
    page,
    setPage,
    total
  } = useAssetMasterData();

  // Reference data hooks
  const { refLocData } = useRefLocation();
  const { refCategoryData } = useRefCategory();
  const { refDeptData } = useRefDepartment();
  const { refItemClassData } = useRefItemClass();

  // Extract options from reference data
  const locationOptions = useMemo(() => 
    ['', ...(refLocData?.map(item => item.LocationName) || [])], 
    [refLocData]
  );
  
  const categoryOptions = useMemo(() => 
    ['', ...(refCategoryData?.map(item => item.category) || [])], 
    [refCategoryData]
  );
  
  const departmentOptions = useMemo(() => 
    ['', ...(refDeptData?.map(item => item.Department) || [])], 
    [refDeptData]
  );
  
  const assetClassOptions = useMemo(() => 
    ['', ...(refItemClassData?.map(item => item.itemClass) || [])], 
    [refItemClassData]
  );

  // 1. DRAFT STATE
  const [draftSearchQuery, setDraftSearchQuery] = useState("");
  const [draftSelectedAssets, setDraftSelectedAssets] = useState([]);
  const [draftSelectedLocation, setDraftSelectedLocation] = useState('');
  const [draftSelectedCategory, setDraftSelectedCategory] = useState('');
  const [draftSelectedDepartment, setDraftSelectedDepartment] = useState('');
  const [draftSelectedAssetClass, setDraftSelectedAssetClass] = useState('');

  // 2. COMMITTED FILTER STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState('');
  const [filterKey, setFilterKey] = useState(0);

  // Detail panel state
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState(null);
  
  // UI State
  const [isFetching, setIsFetching] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [showFilters, setShowFilters] = useState(false);
  const [displayAssets, setDisplayAssets] = useState([]);

  // Filter options for Autocomplete
  const filterOptions = createFilterOptions({
    stringify: (option) => `${option.FacNO} ${option.FacName} ${option.Description}`,
  });

  // Check if any filter is active
  const isFilterActive = searchQuery.trim() !== "" 
    || selectedAssets.length > 0 
    || selectedLocation !== '' 
    || selectedCategory !== '' 
    || selectedDepartment !== '' 
    || selectedAssetClass !== '';

  // Filter assets based on committed filters
  useEffect(() => {
    if (!assets || assets.length === 0 || !isFilterActive) {
      setDisplayAssets([]);
      return;
    }
    
    const filtered = assets.filter(item => {
      // Filter by Search Text
      const matchesText = searchQuery.trim() === "" ||
        item.FacNO?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.FacName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by Selected Assets
      const matchesSelected = selectedAssets.length === 0 ||
        selectedAssets.some(sel => sel.FacNO === item.FacNO);

      // Filter by Location (single selection)
      const matchesLocation = selectedLocation === '' ||
        item.ItemLocation === selectedLocation;

      // Filter by Category (single selection)
      const matchesCategory = selectedCategory === '' ||
        item.CATEGORY === selectedCategory;

      // Filter by Department (single selection)
      const matchesDepartment = selectedDepartment === '' ||
        item.Department === selectedDepartment;

      // Filter by Asset Class (single selection)
      const matchesAssetClass = selectedAssetClass === '' ||
        item.ItemClass === selectedAssetClass;

      return matchesText && matchesSelected && matchesLocation && 
             matchesCategory && matchesDepartment && matchesAssetClass;
    });
    
    setDisplayAssets(filtered);
  }, [assets, searchQuery, selectedAssets, selectedLocation, 
      selectedCategory, selectedDepartment, selectedAssetClass, isFilterActive]);

  // Handle asset click - open detail panel
  const handleAssetClick = (asset) => {
    setSelectedAssetForDetail(asset);
    setDetailPanelOpen(true);
  };

  // Handle close detail panel
  const handleCloseDetailPanel = () => {
    setDetailPanelOpen(false);
    setSelectedAssetForDetail(null);
  };

  // Handle Go button click
  const handleGoClick = async () => {
    setIsFetching(true);
    
    try {
      // Fetch assets if not already loaded
      if (!assets || assets.length === 0) {
        await fetchAssets();
      }
      
      // Commit all draft filters
      setSearchQuery(draftSearchQuery);
      setSelectedAssets(draftSelectedAssets);
      setSelectedLocation(draftSelectedLocation);
      setSelectedCategory(draftSelectedCategory);
      setSelectedDepartment(draftSelectedDepartment);
      setSelectedAssetClass(draftSelectedAssetClass);
      setPage(0);
      
      setSnackbarMessage('Filters applied');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setSnackbarMessage('Failed to load assets. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle Clear button click
  const handleClearClick = () => {
    // Clear draft states
    setDraftSearchQuery("");
    setDraftSelectedAssets([]);
    setDraftSelectedLocation('');
    setDraftSelectedCategory('');
    setDraftSelectedDepartment('');
    setDraftSelectedAssetClass('');
    
    // Clear committed states
    setSearchQuery("");
    setSelectedAssets([]);
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedDepartment('');
    setSelectedAssetClass('');
    
    setFilterKey(prev => prev + 1);
    setPage(0);
    setDisplayAssets([]);
    
    setSnackbarMessage('All filters cleared');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Handle retry
  const handleRetry = async () => {
    setIsFetching(true);
    try {
      await fetchAssets();
      setSnackbarMessage('Assets loaded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Still unable to load assets. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsFetching(false);
    }
  };

  // Active Filters Component
  const ActiveFilters = () => {
    const filters = [];
    
    if (searchQuery) {
      filters.push({ label: `Search: ${searchQuery}`, type: 'search' });
    }
    if (selectedAssets.length > 0) {
      filters.push({ label: `${selectedAssets.length} asset(s) selected`, type: 'assets' });
    }
    if (selectedLocation) {
      filters.push({ label: `Location: ${selectedLocation}`, type: 'location' });
    }
    if (selectedCategory) {
      filters.push({ label: `Category: ${selectedCategory}`, type: 'category' });
    }
    if (selectedDepartment) {
      filters.push({ label: `Department: ${selectedDepartment}`, type: 'department' });
    }
    if (selectedAssetClass) {
      filters.push({ label: `Asset Class: ${selectedAssetClass}`, type: 'class' });
    }
    
    if (filters.length === 0) return null;
    
    return (
      <Box sx={{ mb: 2, overflow: 'auto'}} >
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
          Active Filters:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.map((filter, idx) => (
            <Chip
              key={idx}
              label={filter.label}
              size="small"
              onDelete={() => {
                if (filter.type === 'search') {
                  setDraftSearchQuery('');
                  setSearchQuery('');
                } else if (filter.type === 'assets') {
                  setDraftSelectedAssets([]);
                  setSelectedAssets([]);
                } else if (filter.type === 'location') {
                  setDraftSelectedLocation('');
                  setSelectedLocation('');
                } else if (filter.type === 'category') {
                  setDraftSelectedCategory('');
                  setSelectedCategory('');
                } else if (filter.type === 'department') {
                  setDraftSelectedDepartment('');
                  setSelectedDepartment('');
                } else if (filter.type === 'class') {
                  setDraftSelectedAssetClass('');
                  setSelectedAssetClass('');
                }
                setFilterKey(prev => prev + 1);
              }}
            />
          ))}
          <Chip
            label="Clear All"
            size="small"
            color="error"
            variant="outlined"
            onClick={handleClearClick}
          />
        </Box>
      </Box>
    );
  };

  const isLoadingData = isFetching || isLoading;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f9fafb', justifyContent: 'center'}}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', p: 2, position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
          Asset Master
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          Search and filter assets by multiple criteria
        </Typography>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}
          sx={{ 
            width: '100%', 
            fontSize: '0.875rem', 
            py: 0, // Reduces vertical padding
            alignItems: 'center' 
          }}  
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Filter Section */}
      <Paper sx={{ p: 2, borderRadius: 0 }}>
        {/* Search Assets Autocomplete */}
        <Autocomplete
          key={`asset-search-${filterKey}`}
          multiple
          limitTags={2}
          size="small"
          options={assets}
          filterOptions={filterOptions}
          value={draftSelectedAssets}
          onChange={(e, newValue) => setDraftSelectedAssets(newValue)}
          inputValue={draftSearchQuery}
          onInputChange={(e, newInputValue) => setDraftSearchQuery(newInputValue)}
          getOptionLabel={(option) => `${option.FacNO} - ${option.FacName}`}
          renderOption={(props, option) => (
            <li {...props} key={option.FacNO} style={{ padding: '4px 8px' }}>
              <Box component="span" sx={{ fontSize: '0.875rem', display: 'block' }}>
                <strong>{option.FacNO}</strong> - {option.FacName}
                <br />
                <small>{option.Description}</small>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Search Assets" placeholder="Search by asset no. or name" />
          )}
          sx={{ 
            mb: 2,
            // Targets the input element and its placeholder
            "& .MuiInputBase-input::placeholder": {
              fontSize: "0.75rem", // Reduces size
              color: "gray",       // Sets color to gray
              opacity: 1,          // Ensures the color isn't washed out
            },
            // Optional: match the input text size to the placeholder size
            "& .MuiInputBase-input": {
              fontSize: "0.875rem",
            }
          }}
          disabled={isLoadingData}
        />

        {/* Toggle Advanced Filters */}
        <Button
          variant="body2"
          size="small"
          onClick={() => setShowFilters(!showFilters)}
          startIcon={<FilterListIcon />}
          sx={{ mb: showFilters ? 2 : 0, textTransform: 'none' }}
          disabled={isLoadingData}
        >
          {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>

        {/* Advanced Filters - Single Selection Dropdowns */}
        <Collapse in={showFilters}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, }}>
            {/* Location Filter - Single Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={draftSelectedLocation}
                onChange={(e) => setDraftSelectedLocation(e.target.value)}
                label="Location"
                disabled={isLoadingData}
              >
                {locationOptions.map((option) => (
                  <MenuItem key={option || 'none'} value={option} sx={{ fontSize: '.80rem', py: 0.5, minHeight: 'auto' }}>
                    {option || 'All Locations'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category Filter - Single Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={draftSelectedCategory}
                onChange={(e) => setDraftSelectedCategory(e.target.value)}
                label="Category"
                disabled={isLoadingData}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option || 'none'} value={option} sx={{ fontSize: '.80rem', py: 0.5, minHeight: 'auto' }}>
                    {option || 'All Categories'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Asset Class Filter - Single Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Asset Class</InputLabel>
              <Select
                value={draftSelectedAssetClass}
                onChange={(e) => setDraftSelectedAssetClass(e.target.value)}
                label="Asset Class"
                disabled={isLoadingData}
              >
                {assetClassOptions.map((option) => (
                  <MenuItem key={option || 'none'} value={option} sx={{ fontSize: '.80rem', py: 0.5, minHeight: 'auto' }}>
                    {option || 'All Classes'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Department Filter - Single Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={draftSelectedDepartment}
                onChange={(e) => setDraftSelectedDepartment(e.target.value)}
                label="Department"
                disabled={isLoadingData}
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option || 'none'} value={option} sx={{ fontSize: '.80rem', py: 0.5, minHeight: 'auto' }}>
                    {option || 'All Departments'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <CustomBtn 
            variant="goBtn" 
            iconType="go" 
            onClick={handleGoClick}
            disabled={isLoadingData}
          >
            Go
          </CustomBtn>
        </Box>
      </Paper>


      <div className='flex justify-center'>{isLoadingData ? <CircularProgress size={40} /> : ''}</div>

      {/* Active Filters Display */}
      <Box sx={{ px: 2, pt: 2 }}>
        <ActiveFilters />
      </Box>

      {/* Results Section - Asset Cards */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        {!isFilterActive ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>No filters applied</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
              Use the search or filters above to find assets
            </Typography>
          </Box>
        ) : isLoadingData && displayAssets.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography sx={{ mt: 2, color: '#6b7280' }}>Loading assets...</Typography>
          </Box>
        ) : error && displayAssets.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ color: '#f87171', fontSize: 48, mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#4b5563', fontWeight: 500 }}>
              Failed to load assets
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1, mb: 2 }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Box>
        ) :  (
          <>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1, paddingLeft: 1}}>
              Found {displayAssets.length} asset{displayAssets.length !== 1 ? 's' : ''}
            </Typography>
            {displayAssets.map((asset, index) => (
              <AssetCardItem 
                key={asset.FacNO || index} 
                asset={asset} 
                onClick={handleAssetClick}
              />
            ))}
          </>
        )}
      </Box>

      {/* Asset Detail Slide Panel */}
      <AssetDetailPanel
        open={detailPanelOpen}
        onClose={handleCloseDetailPanel}
        asset={selectedAssetForDetail}
        fetchAssetByFacN0={fetchAssetByFacN0}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 3;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}

export default MvTansactionPage;