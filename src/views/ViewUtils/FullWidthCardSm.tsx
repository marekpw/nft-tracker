import { Card } from '@mui/material';
import React from 'react';

export const FullWidthCardSm = (props: React.ComponentProps<typeof Card>) => (
  <Card 
    {...props} 
    sx={theme => ({
      [theme.breakpoints.down('sm')]: {
        ml: '-24px',
        width: `calc(100% + 48px)`,
        borderRadius: 0,
      },
      ...props.sx
    })}
  />
); 