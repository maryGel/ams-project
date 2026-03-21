import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function AssetCardItem({ asset, onClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  // Check if text exceeds one line
  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  }, [asset.FacName]); // Re-run if the name changes

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className='border-b cursor-pointer hover:bg-gray-50' 
      onClick={() => onClick(asset)}
    >
      <div className='p-2 grid grid-cols-[1fr_2rem] items-start'>
        
        <div className='flex flex-col pl-1 overflow-hidden'>
          {/* FacName */}
          <Typography
            ref={textRef}
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              lineHeight: 1.2,
              whiteSpace: isExpanded ? 'normal' : 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {asset.FacName}
          </Typography>

          {/* Conditional See More Link */}
          {isOverflowing && (
            <Typography 
              variant="caption" 
              component="span"
              onClick={handleToggle}
              sx={{ 
                color: '#1976d2',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 600,
                mt: 0.2,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {isExpanded ? "See Less" : "See More"}
            </Typography>
          )}

          {/* Asset ID Footer */}
          <Typography 
            variant="caption" 
            sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.75rem' }}
          >
            {asset.FacNO}
          </Typography>
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 0.5 }}>
          <ChevronRightIcon sx={{ color: 'rgba(0,0,0,0.54)' }} />
        </Box>
      </div>
    </div>
  );
}

export default AssetCardItem;