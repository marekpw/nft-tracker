import { ComponentProps } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Grid, useTheme } from '@mui/material';
import { darken } from '@mui/material/styles';
import { getTime, eachDayOfInterval, addDays } from 'date-fns';
import groupBy from 'lodash.groupby';
import flatMap from 'lodash.flatmap';
import transform from 'lodash.transform';

import { ContentWrapper } from './ViewUtils/ContentWrapper';
import { useTradeInfo } from '../hooks/useTradeInfo';
import { WeeklyStatisticsChart } from '../components/WeeklyStatisticsChart/WeeklyStatisticsChart';
import { DualPrice } from '../components/DualPrice/DualPrice';
import { EthIcon } from '../components/EthIcon/EthIcon';

interface StatisticsCardProps extends ComponentProps<typeof Card> {
  title: string;
  floatingEthSymbol?: boolean;
}
const StatisticsCard = (props: StatisticsCardProps) => {
  const { title, floatingEthSymbol = false, children, ...other } = props;

  return (
    <Card {...other} sx={{ height: '100%', p: '12px 24px', ...other.sx }}>
      <CardHeader title={title} />
      <CardContent sx={{ position: 'relative' }}>
        {children}

        {floatingEthSymbol && (
          <EthIcon sx={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            bottom: '-24px',
            right: '-32px',
            fill: theme => theme.palette.primary.light,
            opacity: 0.3
          }} />
        )}
      </CardContent>
    </Card>
  );
}

export const Statistics = () => {
  const { trades } = useTradeInfo('weekly');
  const theme = useTheme();

  const { nfts, labels } = trades;

  if (!labels.length) {
    return <></>;
  }

  const firstLabel = labels[0];
  const days = eachDayOfInterval({ start: addDays(firstLabel, 1), end: Date.now() })
    .map(getTime)
    .reverse();

  const flattened = flatMap(nfts, nft => Object.entries(nft));

  const grouped = groupBy(flattened, point => {
    const [timestamp] = point;
    return days.find(day => parseInt(timestamp) > day);
  });

  const sumOf = flattened.reduce((acc, point) => {
    const [, values] = point;
    return {
      trades: acc.trades + values[0],
      volume: acc.volume + values[2],
      networkFees: acc.networkFees + values[3],
      marketplaceFees: acc.marketplaceFees + values[4],
      royalties: acc.royalties + values[5],
      gamestopTrades: acc.gamestopTrades + values[6],
    };
  }, {
    trades: 0,
    volume: 0,
    networkFees: 0,
    marketplaceFees: 0,
    royalties: 0,
    gamestopTrades: 0,
  });

  const gamestopRatio = Math.round(sumOf.gamestopTrades / sumOf.trades * 100);

  // Lodash places the remaining items under the "undefined" umbrella. These are trades that happened on the first day of the weekly data which we don't show as it is incomplete.
  delete grouped['undefined'];

  const mapped = transform(grouped, (result, points, key) => {
    result[key] = points.reduce((acc, point) => {
      const [, values] = point;
      const sums = acc.map((prevValue, index) => prevValue + values[index]);

      // remove Gamestop trades from the trades because we will be displaying those two in a stacked bar chart.
      sums[0] = sums[6] - sums[0];

      // Typescript doesn't properly infer the type for acc.map
      return sums as typeof values;
    }, [0, 0, 0, 0, 0, 0, 0]);
  }, {} as { [key: string]: [number, number, number, number, number, number, number] });

  return (
    <ContentWrapper scrollable>
      <Box sx={{ mb: '24px' }}>
        <Typography variant='h4'>Weekly Statistics</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Weekly Volume' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={sumOf.volume} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Weekly Trades' sx={{ textAlign: 'center' }}>
            <Typography variant='h2'>{sumOf.trades}</Typography>
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Gamestop Trade Ratio' sx={{ textAlign: 'center' }}>
            <Typography variant='h2'>{gamestopRatio}%</Typography>
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Fees Collected (Loopring)' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={sumOf.networkFees} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Fees Collected (Marketplace)' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={sumOf.marketplaceFees} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Royalties Paid Out' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={sumOf.royalties} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Volume'>
            <WeeklyStatisticsChart
              height={300}
              points={mapped}
              dataset={2}
              label='Volume'
              formatTooltip={value => parseFloat(value.toFixed(1)) + ' ETH'}
              tooltipColor={theme.palette.success.light}
              color={theme.palette.success.light}
            />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Fees Collected'>

            <WeeklyStatisticsChart
              height={300}
              points={mapped}
              dataset={[3, 4, 5]}
              label={['Network', 'Marketplace', 'Royalties']}
              formatTooltip={value => parseFloat(value.toFixed(1)) + ' ETH'}
              tooltipColor={theme.palette.warning.light}
              color={[
                darken(theme.palette.warning.light, 0.5),
                darken(theme.palette.warning.light, 0.25),
                theme.palette.warning.light,
              ]}
            />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Trades'>
            <WeeklyStatisticsChart
              height={300}
              points={mapped}
              dataset={[0, 6]}
              label={['Other', 'Gamestop Marketplace']}
              formatTooltip={value => value + ' Trades'}
              tooltipColor={theme.palette.primary.light}
              color={[
                darken(theme.palette.primary.light, 0.5),
                theme.palette.primary.light,
              ]}
            />
          </StatisticsCard>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};