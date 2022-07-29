import { TradeBuckets } from "../hooks/useTradeInfo";

export const countBucketValues = (buckets: TradeBuckets, bucketThresholdTimestamp: number = 0) => {
  return Object.entries(buckets).reduce((accumulator, [bucketTime, value]) => {
    if (parseInt(bucketTime) < bucketThresholdTimestamp) {
      return accumulator;
    }

    const [trades, , volume] = value as any;

    return {
      volume: accumulator.volume + parseFloat(volume),
      trades: accumulator.trades + trades,
    }
  }, {
    volume: 0,
    trades: 0
  });
}