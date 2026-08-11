import React from 'react';
import { Box } from '@mui/material';

const LOGO_SRC = '/logo.png';

const BrandLogo = ({ height = 32, width, sx = {}, alt = 'Brand logo' }) => (
  <Box
    component="img"
    src={LOGO_SRC}
    alt={alt}
    sx={{
      height,
      width: width ?? height,
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block',
      flexShrink: 0,
      bgcolor: '#ffffff',
      ...sx,
    }}
  />
);

export default BrandLogo;
