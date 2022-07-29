import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Link } from '@mui/material';
import { useLocalStorage } from '@rehooks/local-storage';
import { formatDistanceStrict } from 'date-fns';

import { StyledGrid } from './StyledGrid';
import { NftIllustration } from '../Nft/NftIllustration';
import { DualPrice } from '../DualPrice/DualPrice';
import { truncateAddress } from '../../util/truncateAddress';
import { useLatestTransactions } from '../../hooks/useLatestTransactions';

export interface TransactionTableProps extends Partial<React.ComponentProps<typeof StyledGrid>> {
}

export const TransactionTable = (props: TransactionTableProps) => {
  const [displayImages] = useLocalStorage('transaction_images', false);
  const { state, transactions } = useLatestTransactions();
  const now = Date.now();

  const etherScanLink = (address: string) => (
    <Link target='_blank' href={`https://etherscan.io/address/${address}`}>
      {truncateAddress(address)}
    </Link>
  );

  const columns: GridColDef[] = [
    {
      field: 'nft',
      headerName: 'NFT',
      align: 'center',
      headerAlign: 'center',
      width: 120,
      sortable: false,
      renderCell: params => <NftIllustration displayImage={displayImages} nftId={params.value} sx={{ width: 36, height: 36 }} />
    },
    {
      field: 'time',
      headerName: 'Time',
      minWidth: 150,
      flex: 1,
      valueFormatter: params => formatDistanceStrict(new Date(params.value), now, { addSuffix: true })
    },
    {
      field: 'id',
      headerName: 'TX',
      width: 120,
      sortable: false,
      renderCell: params => (
        <Link target='_blank' href={`https://explorer.loopring.io/tx/${params.value}`}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'seller',
      headerName: 'Seller',
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: params => etherScanLink(params.value),
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: params => etherScanLink(params.value),
    },
    {
      field: 'price',
      headerName: 'Price (excl. fee)',
      minWidth: 150,
      renderCell: params => <DualPrice ethPrice={params.value} />
    },
    {
      field: 'fee',
      headerName: 'Fees',
      minWidth: 150,
      renderCell: params => <DualPrice ethPrice={params.value} />
    },
  ];

  const rows = transactions
    .sort((a, b) => b.ts - a.ts)
    .map(tx => ({
      id: tx.id,
      nft: tx.nftId,
      time: tx.ts,
      seller: tx.seller,
      buyer: tx.buyer,
      price: tx.price,
      fee: tx.fee,
    }));

  return (
    <StyledGrid
      rows={rows}
      columns={columns}
      rowHeight={60}
      disableSelectionOnClick
      disableColumnMenu
      sortingOrder={['desc', 'asc']}
      initialState={{
        sorting: {
          sortModel: [{ field: 'time', sort: 'desc' }],
        },
      }}
      loading={state === 'loading'}
      {...props}
    />
  );
};