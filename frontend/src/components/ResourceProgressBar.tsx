import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ResourceProgressBarProps {
  label: string;
  value: number;
}

const ResourceProgressBar: React.FC<ResourceProgressBarProps> = ({ label, value }) => {
  const getColor = (val: number) => {
    if (val > 85) return 'error';
    if (val > 60) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ width: '100%', my: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        color={getColor(value)}
      />
    </Box>
  );
};

export default ResourceProgressBar;