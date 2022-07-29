import { ComponentProps, ReactNode } from 'react';
import { Link } from '@mui/material';
import { useNftData } from '../../hooks/useNftData';
import { useLocalStorage } from '@rehooks/local-storage';

export interface NftAnchorProps extends ComponentProps<typeof Link> {
  nftId: string;
  children?: ReactNode;
}

export const NftAnchor = (props: NftAnchorProps) => {
  const { nftId, children, ...other } = props;
  const { title, token, eId } = useNftData(nftId);
  const [useGamestopLinks] = useLocalStorage('gamestop_nft_links', false);

  let href: string;
  if (useGamestopLinks) {
    
    href = `https://nft.gamestop.com/token/${token}/${nftId}/`;
  } else {
    const fullId = eId
      .replace('{t}', token)
      .replace('{n}', nftId);

    href = `https://explorer.loopring.io/nft/${fullId}`;
  }

  return (
    <Link
      href={href}
      underline='hover'
      target='_blank'
      {...other}
    >
      {children ?? title}
    </Link>
  );
}