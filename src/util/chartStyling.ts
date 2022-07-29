import type { TooltipOptions } from "chart.js";
import { DeepPartial } from "chart.js/types/utils";

export const tooltipOptions = (color: string, valueFormatter: (value: number) => string): DeepPartial<TooltipOptions> => ({
  displayColors: false,
  callbacks: {
    label: tooltipItem => {
      const value = tooltipItem.parsed.y;
      return valueFormatter(value);
    }
  },
  titleFont: {
    weight: '400',
  },
  bodyFont: {
    weight: '600',
    size: 16
  },
  titleAlign: 'center',
  bodyAlign: 'center',
  bodyColor: color,
});
