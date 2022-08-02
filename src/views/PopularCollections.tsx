import { Box, Typography, Alert } from '@mui/material';
import { useLocalStorage } from '@rehooks/local-storage';
import { PopularCollectionTable } from '../components/Table/PopularCollectionTable';
import { TimeFilterMenu } from '../components/Table/TimeFilterMenu';
import { FullWidthCardSm } from './ViewUtils/FullWidthCardSm';
import { ContentWrapper } from './ViewUtils/ContentWrapper';
import { useFtue } from '../hooks/useFtue';
import { ChartDataset, TableOptionsMenu } from '../components/Table/TableOptionsMenu';

export const DEFAULT_TIME = 3600 * 1000 * 24;

export const PopularCollections = () => {
  const [dataset, setDataset] = useLocalStorage<ChartDataset>('popular_collection_dataset_v1.1', 'avgPrice');
  const [minTrades, setMinTrades] = useLocalStorage<number>('popular_collection_mintrades', 3);
  const [timeRange, setTimeRange] = useLocalStorage('popular_collection_timerange_v1.1', DEFAULT_TIME);
  const { show: showFtue, acknowledge } = useFtue('gamestop_collections');
  return (
    <ContentWrapper column>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>Popular Collections</Typography>

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
      {showFtue && (
        <Alert onClose={acknowledge} severity='warning' sx={{ mt: '24px', width: '100%' }}>
          Collections refer to tokens on the network. They will not always correspond to the collections on the Gamestop NFT Marketplace.
        </Alert>
      )}
      <FullWidthCardSm sx={{ flex: 1, mt: '24px' }}>
        <PopularCollectionTable
          minTrades={minTrades}
          chartDataset={dataset}
          timeRange={timeRange}
          pageSize={20}
        />
      </FullWidthCardSm>
    </ContentWrapper>
  );
};