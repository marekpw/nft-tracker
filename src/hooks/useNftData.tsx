import { useMainData } from '../providers/MainDataProvider';

export const useNftData = (nftId: string) => {
  const { nfts } = useMainData();

  return {
    title: 'Unknown NFT',
    image: undefined,
    ...nfts?.[nftId],
  };
};