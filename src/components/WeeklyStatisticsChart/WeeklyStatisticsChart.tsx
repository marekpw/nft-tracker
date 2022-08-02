import { ComponentProps } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

import { tooltipOptions } from '../../util/chartStyling';

export interface WeeklyStatisticsChartProps extends Partial<Omit<ComponentProps<typeof Bar>, 'color'>> {
  points: { [key: string]: number[] },
  dataset: number | number[],
  label: string | string[],
  color: string | string[],
}

export const WeeklyStatisticsChart = (props: WeeklyStatisticsChartProps) => {
  const { points, dataset, label, color, ...other } = props;
  
  const datasets = (Array.isArray(dataset) ? dataset : [dataset]).map((dataset, index) => {
    const data = Object.entries(points).map(([ timestamp, value ]) => ({
      x: new Date(parseInt(timestamp)),
      y: value[dataset],
    }));

    const setLabel = Array.isArray(label) ? label[index] : label;
    const setColor = Array.isArray(color) ? color[index] : color;

    return { data, label: setLabel, backgroundColor: setColor };
  });

  return (
    <Bar
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: Array.isArray(label)
          },
          tooltip: tooltipOptions('red', value => dataset === 0 ? `${value} Trades` : `${parseFloat(value.toFixed(1))} ETH`),
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'E, MMM do',
            },
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }}
      data={{
        datasets
      }}
      {...other}
    />
  )
}