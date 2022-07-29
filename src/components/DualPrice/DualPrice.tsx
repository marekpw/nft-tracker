import { ComponentProps } from 'react';
import { Box, Typography } from '@mui/material';
import { usePriceFormatter } from '../../hooks/usePriceFormatter';
import { EthIcon } from '../EthIcon/EthIcon';

export interface DualPriceProps {
  ethPrice: number;
  ethDecimal?: number;
  showEthIcon?: boolean;
  ethPriceProps?: ComponentProps<typeof Typography>,
  usdPriceProps?: ComponentProps<typeof Typography>
}

export const DualPrice = (props: DualPriceProps) => {
  const {
    ethPrice,
    ethDecimal = 4,
    showEthIcon = true,
    ethPriceProps,
    usdPriceProps
  } = props;
  const priceFormatter = usePriceFormatter();

  return (
    <Box>
      <Typography variant='body2' {...ethPriceProps} sx={{ display: 'inline-flex', alignItems: 'center', color: 'primary.main', ...ethPriceProps?.sx }}>
        {parseFloat(ethPrice.toFixed(ethDecimal))}
        {showEthIcon && (<EthIcon />)}
      </Typography>
      <Typography variant='caption' {...usdPriceProps} sx={{ color: 'text.secondary', display: 'block', ...usdPriceProps?.sx }}>≈ {priceFormatter.format(ethPrice)}</Typography>
    </Box>
  );
};