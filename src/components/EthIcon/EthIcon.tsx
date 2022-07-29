import { ComponentProps } from 'react';
import { SvgIcon } from '@mui/material';

export const EthIcon = (props: ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} sx={{ width: '16px', height: '16px', ...props.sx }}>
    <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox='0 0 24 24'>
      <title>Ethereum</title>
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  </SvgIcon>
);