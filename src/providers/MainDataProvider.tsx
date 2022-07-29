import { createContext, useContext } from 'react';

import metadata from '../data/metadata.json';
import nfts from '../data/nfts.json';

export interface MainData {
  updatedAt: number;
  volume: number;
  trades: number;
  lastTransaction: number;
  nfts: {
    [key: string]: {
      token: string,
      lastPrice: number,
      eId: string;
      title?: string,
      image?: string,
    }
  };
}

const mainDataContext = createContext<MainData>({
  nfts: {},
  updatedAt: 0,
  volume: 0,
  trades: 0,
  lastTransaction: 0,
});

export const useMainData = () => useContext(mainDataContext);

export const MainDataProvider = (props: React.PropsWithChildren<{}>) => {
  return (
    <mainDataContext.Provider value={{
      nfts,
      ...metadata
    }}>
      {props.children}
    </mainDataContext.Provider>
  );
};