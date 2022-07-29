import { ExchangeRate, useExchangeRate } from '../providers/ExchangeRateProvider';

export const usePriceFormatter = () => {
  const rates = useExchangeRate();

  return {
    format: (eth: number, currency: keyof ExchangeRate = 'usd') => {
      const usLocaleFormatter = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
      });
      if (rates?.[currency] !== null) {
        const currencyPrice = eth * rates[currency]!;
        return usLocaleFormatter.format(currencyPrice);
      }

      return null;
    }
  }
}