import { useState, useEffect } from 'react';

export type TradeRange = 'daily' | 'weekly';

/**
 * Trade buckets information to display in a chart.
 * The key is the timestamp of the bucket (converted to string)
 * The value is an array of numbers for the bucket - [trades, avgPrice, sum, feesSum]
 */
export type TradeBuckets = { [key: string]: [number, number, number, number] };

export interface TradeInfo {
  state: 'loading' | 'error' | 'ok';
  trades: {
    labels: number[],
    nfts: { [key: string]: TradeBuckets },
    tokens: { [key: string]: TradeBuckets },
  }
}

export const useTradeInfo = (range: TradeRange) => {
  const [tradeInfo, setTradeInfo] = useState<TradeInfo>({
    state: 'loading',
    trades: {
      labels: [],
      nfts: {},
      tokens: {}
    }
  });

  useEffect(() => {
    setTradeInfo(info => ({ ...info, state: 'loading' }));

    (async () => {
      try {
        const trades = range === 'daily'
          ? await import('../data/daily.json')
          : await import('../data/weekly.json');
        
        setTradeInfo({
          state: 'ok',
          trades: trades.default as any,
        });
      } catch (error) {
        setTradeInfo(info => ({ ...info, state: 'error' }));
      }
    })();
  }, [range]);

  return tradeInfo;
};