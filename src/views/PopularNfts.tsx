import { Box, Typography } from '@mui/material';
import { useLocalStorage } from '@rehooks/local-storage';
import { PopularNftTable } from '../components/Table/PopularNftTable';
import { TimeFilterMenu } from '../components/Table/TimeFilterMenu';
import { FullWidthCardSm } from './ViewUtils/FullWidthCardSm';
import { ContentWrapper } from './ViewUtils/ContentWrapper';
import { TableOptionsMenu, ChartDataset } from '../components/Table/TableOptionsMenu';

export const DEFAULT_TIME = 3600 * 1000 * 24;

export const PopularNfts = () => {
  const [dataset, setDataset] = useLocalStorage<ChartDataset>('popular_nft_dataset_v1.1', 'avgPrice');
  const [minTrades, setMinTrades] = useLocalStorage<number>('popular_nft_mintrades', 3);
  const [timeRange, setTimeRange] = useLocalStorage('popular_nft_timerange_v1.1', DEFAULT_TIME);
  return (
    <ContentWrapper column>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>Popular NFTs</Typography>

        <TimeFilterMenu 
          sx={{ ml: 'auto', mr: '10px' }}
          options={[
            { rangeTime: 3600 * 1000 * 3, label: '3 Hours' },
            { rangeTime: 3600 * 1000 * 12, label: '12 Hours' },
            { rangeTime: DEFAULT_TIME, label: '24 Hours' },
            { rangeTime: 3600 * 1000 * 24 * 7, label: '7 Days' },
          ]}
          onTimeSelect={time => setTimeRange(time)}
          selectedTime={timeRange}
        />
        <TableOptionsMenu
          dataset={dataset}
          onDatasetChange={setDataset}
          minTrades={minTrades}
          onMinTradesChange={setMinTrades}
        />
      </Box>
      
      <FullWidthCardSm sx={{ flex: 1, mt: '24px' }}>
        <PopularNftTable
          timeRange={timeRange}
          chartDataset={dataset}
          minTrades={minTrades}
          pageSize={20}
        />
      </FullWidthCardSm>
    </ContentWrapper>
  );
};