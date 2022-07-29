import { ComponentProps, useMemo, useCallback } from 'react';
import { StyledGrid } from './StyledGrid';
import { GridColDef } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useLocalStorage } from '@rehooks/local-storage';
import { NftIllustration } from '../Nft/NftIllustration';
import { TokenAnchor } from '../Nft/TokenAnchor';
import { DualPrice } from '../DualPrice/DualPrice';
import { useTradeInfo } from '../../hooks/useTradeInfo';
import { countBucketValues } from '../../util/countBucketValues';
import { useMainData } from '../../providers/MainDataProvider';
import { TradingChart, TradingChartProps } from '../Nft/TradingChart';

export interface PopularCollectionTableProps extends Partial<ComponentProps<typeof StyledGrid>> {
  chartDataset?: TradingChartProps['dataset'];
  timeRange: number;
  minTrades?: number;
}

export const PopularCollectionTable = (props: PopularCollectionTableProps) => {
  const {
    chartDataset = 'avgPrice',
    minTrades = 3,
    timeRange
  } = props;

  const lowerBoundTimestamp = Date.now() - timeRange;
  const [displayImages] = useLocalStorage('collection_images', false);

  const { nfts: nftData } = useMainData();
  const { state, trades } = useTradeInfo(lowerBoundTimestamp < Date.now() - 86400 * 1000 ? 'weekly' : 'daily');

  const chartLabels = trades.labels.filter(bucketTime => bucketTime > lowerBoundTimestamp);

  const tokens = useMemo(() => {
    return Object.keys(trades.tokens)
      .map(token => ({
        // add the token ID to be able to use it in the table
        address: token,
        ...countBucketValues(trades.tokens[token], lowerBoundTimestamp)
      }))
      .filter(token => token.trades >= minTrades)
      .sort((a, b) => a.trades > b.trades ? -1 : 1)
      .slice(0, 100);
  }, [trades.tokens, minTrades, lowerBoundTimestamp]);

  const nfts = useMemo(() => {
    return Object.keys(trades.nfts)
      .map(nftId => ({
        // add the NFT ID to be able to use it in the table
        nftId,
        token: nftData[nftId].token,
        ...countBucketValues(trades.nfts[nftId], lowerBoundTimestamp)
      }))
      .filter(nft => nft.trades >= 3)
      .sort((a, b) => a.trades > b.trades ? -1 : 1);
  }, [trades.nfts, nftData, lowerBoundTimestamp]);

  const getTokenNfts = useCallback((address: string) => {
    return nfts
      .filter(nft => nft.token === address)
      .slice(0, 5);
  }, [nfts]);

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
      field: 'address',
      headerName: 'Address',
      sortable: false,
      minWidth: 150,
      flex: 1,
      renderCell: params => <TokenAnchor token={params.value} />,
    },
    {
      field: 'popular',
      renderHeader: () => (
        <>
          Most Popular NFTs
          <Tooltip sx={{ ml: '2px' }} title='Displays up to 5 most popular NFTs that had at least 3 trades within the specified timeframe.'>
            <InfoIcon />
          </Tooltip>
        </>
      ),
      flex: 1,
      minWidth: 220,
      sortable: false,
      renderCell(params) {
        const popular = params.value as typeof nfts;
        
        if (!popular.length) {
          return 'N/A'
        }

        return (
          <div style={{display: 'flex'}}>
            {popular.map(nft => (
              <NftIllustration key={nft.nftId} displayImage={displayImages} nftId={nft.nftId} style={{ width: 36, height: 36, marginRight: 2 }} />
            ))}
          </div>
        );
      },
    },
    {
      field: 'trades',
      headerName: 'Trades',
      width: 150,
    },
    {
      field: 'volume',
      headerName: 'Volume',
      width: 150,
      renderCell: params => <DualPrice ethPrice={params.value} />
    },
    {
      field: 'chart',
      headerName: '',
      sortable: false,
      minWidth: 250,
      maxWidth: 500,
      flex: 1,
      renderCell(params) {
        return <TradingChart labels={chartLabels} buckets={trades.tokens[params.value]} dataset={chartDataset} />
      },
    },
  ];

  const rows = tokens.map((token, index) => ({
    id: index + 1,
    address: token.address,
    popular: getTokenNfts(token.address),
    trades: token.trades,
    volume: token.volume,
    chart: token.address,
  }));

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
          sortModel: [{ field: 'trades', sort: 'desc' }],
        },
      }}
      loading={state === 'loading'}
      {...props}
    />
  );
};