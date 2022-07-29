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

  const totalVolume = flattened.reduce((accumulator, point) => {
    const [, values] = point;
    return accumulator + values[2];
  }, 0);

  const totalTrades = flattened.reduce((accumulator, point) => {
    const [, values] = point;
    return accumulator + values[0];
  }, 0);

  const totalFees = flattened.reduce((accumulator, point) => {
    const [, values] = point;
    return accumulator + values[3];
  }, 0);

  // Lodash places the remaining items under the "undefined" umbrella. These are trades that happened on the first day of the weekly data which we don't show as it is incomplete.
  delete grouped['undefined'];

  const mapped = transform(grouped, (result, points, key) => {
    result[key] = points.reduce((acc, point) => {
      const [, values] = point;
      return [
        acc[0] + values[0], // trades
        acc[1] + values[2], // volume
        acc[2] + values[3]  // fees
      ]
    }, [0, 0, 0])
  }, {} as { [key: string]: [number, number, number] });

  return (
    <ContentWrapper scrollable>
      <Box sx={{ mb: '24px' }}>
        <Typography variant='h4'>Weekly Statistics</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StatisticsCard variant='outlined' title='Weekly Volume' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={totalVolume} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard variant='outlined' title='Fees Collected' floatingEthSymbol sx={{ textAlign: 'center' }}>
            <DualPrice ethPrice={totalFees} ethDecimal={1} showEthIcon={false} ethPriceProps={{ variant: 'h3' }} usdPriceProps={{ variant: 'subtitle1' }} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatisticsCard variant='outlined' title='Weekly Trades' sx={{ textAlign: 'center' }}>
            <Typography variant='h3'>{totalTrades}</Typography>
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Volume'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={1} label='Volume' color={theme.palette.success.light} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Fees Collected'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={2} label='Fees' color={theme.palette.warning.light} />
          </StatisticsCard>
        </Grid>
        <Grid item xs={12} xl={4}>
          <StatisticsCard title='Daily Trades'>
            <WeeklyStatisticsChart height={300} points={mapped} dataset={0} label='Trades' color={theme.palette.primary.light} />
          </StatisticsCard>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};