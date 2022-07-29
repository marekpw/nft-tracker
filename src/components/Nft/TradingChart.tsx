import { useTheme, alpha } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import type { ChartDataset } from 'chart.js';
import { isBefore, startOfYesterday } from 'date-fns';

import type { TradeBuckets } from '../../hooks/useTradeInfo';
import { tooltipOptions } from '../../util/chartStyling';

export interface TradingChartProps {
  labels: number[];
  buckets: TradeBuckets;
  dataset: 'avgPrice' | 'trades' | 'volume';
}

export const TradingChart = (props: TradingChartProps) => {
  const { dataset, buckets, labels } = props;

  const bucketIndex = {
    trades: 0,
    avgPrice: 1,
    volume: 2,
  };

  const theme = useTheme();
  const data = labels.map((label, index) => {
    const defaultValue = index === 0 ? 0 : null;
    const value = buckets[label]?.[bucketIndex[dataset]] ?? defaultValue;
    return {
      x: label,
      y: value,
    };
  });
  const datasetOptions: Record<typeof dataset, Partial<ChartDataset<'line'>>> = {
    avgPrice: {
      label: 'Average ETH Price',
      fill: true,
      backgroundColor: alpha(theme.palette.warning.light, 0.15),
      borderColor: theme.palette.warning.main,
    },
    trades: {
      label: 'Trades',
      fill: true,
      backgroundColor: alpha(theme.palette.primary.light, 0.15),
      borderColor: theme.palette.primary.main,
    },
    volume: {
      label: 'Volume',
      fill: true,
      backgroundColor: alpha(theme.palette.success.light, 0.15),
      borderColor: theme.palette.success.main,
    }
  }

  return (
    <Line
      height={70}
      options={{
        responsive: true,
        parsing: false,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        interaction: {
          axis: 'xy',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          decimation: {
            enabled: true,
            algorithm: 'lttb',
            samples: 10,
          },
          tooltip: tooltipOptions(datasetOptions[dataset].borderColor as string, value => {
            return dataset === 'trades' ? `${value} Trades` : `${parseFloat(value.toFixed(4))} ETH`;
          }),
        },
        spanGaps: true,
        scales: {
          x: {
            display: false,
            type: 'time',
            time: {
              tooltipFormat: isBefore(labels[0], startOfYesterday()) ? 'E, MMM do \'at\' hh:ss a' : 'hh:ss a'
            }
          }
        } 
      }}
      data={{
        datasets: [
          {
            data: data,
            pointRadius: 1,
            ...datasetOptions[dataset],
          },
        ]
      }}
    />
  );
}