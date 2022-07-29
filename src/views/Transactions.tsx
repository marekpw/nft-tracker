import { Box, Typography } from '@mui/material';
import { TransactionTable } from '../components/Table/TransactionTable';
import { FullWidthCardSm } from './ViewUtils/FullWidthCardSm';
import { ContentWrapper } from './ViewUtils/ContentWrapper';

export const Transactions = () => {
  return (
    <ContentWrapper column>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>Transactions</Typography>
        {/* Space for right-side controls */}
      </Box>
      
      <FullWidthCardSm sx={{ flex: 1, mt: '24px' }}>
        <TransactionTable pageSize={100} />
      </FullWidthCardSm>
    </ContentWrapper>
  );
};