import { ComponentProps } from 'react';
import { GridColDef } from '@mui/x-data-grid';

import { StyledGrid } from './StyledGrid'
import { useLocalStorage } from '@rehooks/local-storage';
import { NftIllustration } from '../Nft/NftIllustration';
import { TradingChart, TradingChartProps } from '../Nft/TradingChart';
import { NftAnchor } from '../Nft/NftAnchor';
import { DualPrice } from '../DualPrice/DualPrice';
import { useTradeInfo } from '../../hooks/useTradeInfo';
import { countBucketValues } from '../../util/countBucketValues';
import { useMainData } from '../../providers/MainDataProvider';

export interface PopularNftTableProps extends Partial<ComponentProps<typeof StyledGrid>> {
  chartDataset?: TradingChartProps['dataset'];
  timeRange: number;
  minTrades?: number;
}

export const PopularNftTable = (props: PopularNftTableProps) => {
  const {
    chartDataset = 'avgPrice',
    minTrades = 3,
    timeRange
  } = props;

  const [displayImages] = useLocalStorage('popular_nft_images', true);
  const { nfts: nftData } = useMainData();

  const lowerBoundTimestamp = Date.now() - timeRange;
  const { state, trades } = useTradeInfo(lowerBoundTimestamp < Date.now() - 86400 * 1000 ? 'weekly' : 'daily');

  const chartLabels = trades.labels.filter(bucketTime => bucketTime > lowerBoundTimestamp);
  const datasetLabels: Record<TradingChartProps['dataset'], string> = {
    avgPrice: 'Average Price',
    trades: 'Trades',
    volume: 'Volume'
  };

  const nfts = Object.keys(trades.nfts)
    .map(nftId => ({
      // add the NFT ID to be able to use it in the table
      nftId,
      ...countBucketValues(trades.nfts[nftId], lowerBoundTimestamp)
    }))
    .filter(nft => nft.trades >= minTrades)
    .sort((a, b) => a.trades > b.trades ? -1 : 1)
    .slice(0, 100);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      align: 'center',
      headerAlign: 'center',
      width: 50,
      sortable: false,
    },
    {
      field: 'illustration',
      headerName: 'NFT',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      sortable: false,
      renderCell(params) {
        return <NftIllustration displayImage={displayImages} nftId={params.value} style={{ height: 60, width: 60 }} />
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 250,
      renderCell(params) {
        return <NftAnchor nftId={params.value} sx={{
          color: 'text.primary',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }} />
      },
      sortable: false,
    },
    {
      field: 'purchases',
      headerName: 'Trades',
      width: 120
    },
    {
      field: 'volume',
      headerName: 'Volume',
      width: 150,
      renderCell: params => <DualPrice ethPrice={params.value} />,
    },
    {
      field: 'last_price',
      headerName: 'Last Price',
      width: 150,
      renderCell: params => <DualPrice ethPrice={params.value} />,
    },
    {
      field: 'chart',
      headerName: datasetLabels[chartDataset],
      sortable: false,
      minWidth: 250,
      maxWidth: 500,
      flex: 1,
      renderCell(params) {
        return <TradingChart labels={chartLabels} buckets={trades.nfts[params.value]} dataset={chartDataset} />
      },
    },
  ];

  const rows = nfts.map((nft, index) => {
    return {
      id: index + 1,
      illustration: nft.nftId,
      name: nft.nftId,
      purchases: nft.trades,
      last_price: nftData[nft.nftId].lastPrice || 0,
      volume: nft.volume,
      chart: nft.nftId,
    }
  });

  return (
    <StyledGrid
      rows={rows}
      columns={columns}
      rowHeight={75}
      disableSelectionOnClick
      disableColumnMenu
      sortingOrder={['desc', 'asc']}
      initialState={{
        sorting: {
          sortModel: [{ field: 'purchases', sort: 'desc' }],
        },
      }}
      loading={state === 'loading'}
      {...props}
    />
  );
};