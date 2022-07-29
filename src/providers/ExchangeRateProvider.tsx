import { createContext, useContext, useState } from 'react';
import useInterval from 'use-interval';

export interface ExchangeRate {
  usd: number | null,
}

const exchangeRateContext = createContext<ExchangeRate>({
  usd: null,
});

export const useExchangeRate = () => useContext(exchangeRateContext);

export const ExchangeRateProvider = (props: React.PropsWithChildren<{}>) => {
  const [rates, setRates] = useState({
    usd: null,
  });

  useInterval(async () => {
    try {
      const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      const parsed = await response.json();

      setRates({ usd: parsed.USD });
    } catch (error) {
      console.error('Failed to get USD rate: ', error);
    }
  }, 60000, true);

  return (
    <exchangeRateContext.Provider value={rates}>
      {props.children}
    </exchangeRateContext.Provider>
  );
}