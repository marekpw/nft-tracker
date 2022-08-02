import { ComponentProps } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Grid, useTheme } from '@mui/material';
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
    <Card {...other} sx={{ height: '100%', ...other.sx }}>
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

  const sums = flattened.reduce((accumulator, point) => {
    const [, values] = point;
    return accumulator.map((prevValue, index) => prevValue + values[index]);
  }, [0, 0, 0, 0, 0, 0, 0]);

  const totalTrades = sums[0];
  const totalVolume = sums[2];
  const totalNetworkFees = sums[3];
  const totalMarketplaceFees = sums[4];
  const totalRoyalties = sums[5];
  const gamestopTrades = sums[6];

  const gamestopRatio = Math.round(gamestopTrades / totalTrades * 100);

  // Lodash places the remaining items under the "undefined" umbrella. These are trades that happened on the first day of the weekly data which we don't show as it is incomplete.
  delete grouped['undefined'];

  const mapped = transform(grouped, (result, points, key) => {
    result[key] = points.reduce((acc, point) => {
      const [, values] = point;
      const sums = acc.map((prevValue, index) => prevValue + values[index]);

      // remove Gamestop trades from the trades because we will be displaying those two in a stacked bar chart.
      sums[0] = sums[6] - sums[0];
      return sums;
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
            <DualPrice ethPrice={totalVolume} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Weekly Trades' sx={{ textAlign: 'center' }}>
            <Typography variant='h2'>{totalTrades}</Typography>
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Gamestop Trade Ratio' sx={{ textAlign: 'center' }}>
            <Typography variant='h2'>{gamestopRatio}%</Typography>
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Fees Collected (Loopring)' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={totalNetworkFees} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Fees Collected (Marketplace)' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={totalMarketplaceFees} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4} xl={2}>
          <StatisticsCard variant='outlined' title='Royalties Paid Out' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={totalRoyalties} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Volume'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={2} label='Volume' color={theme.palette.success.light} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Fees Collected'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={[3, 4, 5]} label={['Network', 'Marketplace', 'Royalties']} color={[theme.palette.warning.light, theme.palette.success.light, theme.palette.error.light]} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Trades'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={[0, 6]} label={['Other Marketplaces', 'Gamestop Marketplace']} color={[theme.palette.primary.main, theme.palette.primary.light]} />
          </StatisticsCard>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};