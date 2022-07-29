import { ComponentProps } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import { tooltipOptions } from '../../util/chartStyling';

export interface WeeklyStatisticsChartProps extends Partial<ComponentProps<typeof Bar>> {
  points: { [key: string]: number[] },
  dataset: number,
  label: string,
  color: string,
}

export const WeeklyStatisticsChart = (props: WeeklyStatisticsChartProps) => {
  const { points, dataset, label, color, ...other } = props;

  const data = Object.entries(points).map(([ timestamp, value ]) => ({
    x: new Date(parseInt(timestamp)),
    y: value[dataset],
  }));

  return (
    <Bar
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: tooltipOptions(color, value => dataset === 0 ? `${value} Trades` : `${parseFloat(value.toFixed(1))} ETH`),
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'E, MMM do',
            }
          }
        }
      }}
      data={{
        datasets: [
          {
            data,
            label,
            backgroundColor: color,
            
          }
        ]
      }}
      {...other}
    />
  )
}