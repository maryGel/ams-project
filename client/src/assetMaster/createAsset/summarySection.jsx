import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const SummarySection = ({ title, fields, stepIndex, onEdit }) => (
  <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      <Button 
        size="small" 
        onClick={() => onEdit(stepIndex)}
        sx={{ textTransform: 'none' }}
      >
        Edit
      </Button>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
      {fields.map((field, index) => (
        <Box key={index}>
          <Typography variant="caption" color="text.secondary">
            {field.label}:
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: field.value && field.value !== 'N/A' ? 'normal' : 'bold', 
              color: field.value && field.value !== 'N/A' ? 'text.primary' : 'error.main' 
            }}
          >
            {field.value || 'Required field missing'}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default SummarySection;