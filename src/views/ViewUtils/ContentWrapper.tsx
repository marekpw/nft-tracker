import { Box } from '@mui/material';
import React from 'react';

export interface ContentWrapperProps extends React.ComponentProps<typeof Box> {
  scrollable?: boolean;
  column?: boolean;
}

export const ContentWrapper = (props: ContentWrapperProps) => {
  const { scrollable = false, column = false } = props;

  return (
    <Box {...props} sx={{
      width: '100%',
      height: scrollable ? 'auto' : '100%',
      p: '24px 24px 0',
      ...(column && {
        display: 'flex',
        flexFlow: 'column',
      }),
      ...props.sx 
    }} />
  );
};