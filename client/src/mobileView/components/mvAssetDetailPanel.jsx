import { useState, useMemo, useEffect } from 'react';

// MUI
import { 
  Button, CircularProgress, IconButton, 
  Typography, Card, CardContent, Chip, Divider, Box, 
  Slide, Dialog,
  AppBar, Toolbar, 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';

// Custom Utils
import DateDisplay from '../../Utils/formatDateForInput';
import formatWithCommas from '../../Utils/formatWithCommas'


// Asset Detail Slide Panel Component
function AssetDetailPanel({ open, onClose, asset, fetchAssetByFacN0 }){
  const [detailedAsset, setDetailedAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset && open) {
      const loadDetails = async () => {
        setLoading(true);
        try {
          const result = await fetchAssetByFacN0(asset.FacNO);
          setDetailedAsset(result || asset);
        } catch (err) {
          console.error('Error loading asset details:', err);
          setDetailedAsset(asset);
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [asset, open, fetchAssetByFacN0]);

  const formatFieldLabel = (key) => {
    const labels = {
      FacNO: 'Facility Number',
      FacName: 'Asset Name',
      Description: 'Description',
      Location: 'Location',
      ItemLocation: 'Item Location',
      CATEGORY: 'Category',
      ItemClass: 'Asset Class',
      Status: 'Status',
      Manufacturer: 'Manufacturer',
      Model: 'Model',
      serialNo: 'Serial Number',
      Adate: 'Acquired Date',
      WarrantyExpiry: 'Warranty Expiry',
      LastMaintenance: 'Last Maintenance',
      NextMaintenance: 'Next Maintenance',
      AssignedTo: 'Assigned To',
      Department: 'Department',
      AAmount: 'Cost',
      Percent: 'Useful Life (Years)',
      Abre: 'Salvage Amount',
      balance_unit: 'Quantity',
      suppName: 'Supplier'
    };
    return labels[key] || key;
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
      sx={{ '& .MuiDialog-paper': { margin: 0, width: '100%', height: '100%' } }}
    >
      <AppBar sx={{ position: 'relative', bgcolor: '#1f2937' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <span className='tracking-wide text-white'>
            Asset Details
          </span>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f9fafb', minHeight: '100%', pb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : detailedAsset ? (
          <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Card sx={{ mb: 3, bgcolor: '#eff6ff' }}>
              <CardContent>
                <span  className='font-semibold text-md'>
                  {detailedAsset.FacName || 'Unnamed Asset'}
                </span>
                <Typography variant="subtitle1" sx={{ color: '#4b5563', mb: 1 }}>
                  {detailedAsset.FacNO}
                </Typography>
                {detailedAsset.ItemLocation && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                      {detailedAsset.ItemLocation}
                    </Typography>
                  </Box>
                )}
                {detailedAsset.Department && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                      {detailedAsset.Department}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Asset Information Section */}
            <Card sx={{mb:1 }}>
              <CardContent>
                <span className='flex gap-2 p-1 text-sm font-semibold'>
                  <InfoIcon sx={{ color: '#3b82f6'}} fontSize='small'/>
                  Asset Information
                </span>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', fontSize: 'small' }}>
                  <span className='text-sm tracking-wide text-slate-500'>Description</span>
                  <span>{detailedAsset.Description}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Category</span>
                  <span>{detailedAsset.CATEGORY}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Asset Class</span>
                  <span>{detailedAsset.ItemClass}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Location</span>
                  <span>{detailedAsset.ItemLocation}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Department</span>
                  <span>{detailedAsset.Department}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Acquired Date</span>
                  <DateDisplay value={detailedAsset.Adate} format="short" />
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Unit Cost</span>
                  <span>P {formatWithCommas(detailedAsset.AAmount)}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Quantity</span>
                  <span>{detailedAsset.balance_unit}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Unit</span>
                  <span>{detailedAsset.Unit}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Useful Life(Years)</span>
                  <span>{detailedAsset.Percent}</span>
                  <span className='mt-2 text-sm tracking-wide text-slate-500'>Residual Value</span>
                  <span>{detailedAsset.Abre}</span>
                  {detailedAsset.serialNo &&
                    (<>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Serial Number</span>
                    <span>{detailedAsset.serialNo}</span>
                    </>)
                  }
                  {detailedAsset.Brand &&
                    (<>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Brand</span>
                    <span>{detailedAsset.Brand}</span>
                    </>)
                  }
                  {detailedAsset.Color &&
                    (<>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Color</span>
                    <span>{detailedAsset.Color}</span>
                    </>)
                  }
                  {detailedAsset.StartDate &&
                    (<>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Warranty Start Date</span>
                    <span>{detailedAsset.StartDate}</span>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Warranty End Date</span>
                    <span>{detailedAsset.EndDate}</span>
                    </>)
                  }
                  {detailedAsset.Holder &&
                    (<>
                    <span className='mt-2 text-sm tracking-wide text-slate-500'>Assigned to</span>
                    <span>{detailedAsset.Holder}</span>
                    </>)
                  }
                  
                </Box>
              </CardContent>
            </Card>

            {/* Actions Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<QrCodeScannerIcon />}
                  sx={{ mb: 1 }}
                >
                  Scan QR Code
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                >
                  View Maintenance History
                </Button>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              No asset selected
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default AssetDetailPanel;

