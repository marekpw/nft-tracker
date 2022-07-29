import { PropsWithChildren, HTMLAttributes } from 'react';
import { Link } from '@mui/material';
import { truncateAddress } from '../../util/truncateAddress';

export interface TokenAnchorProps extends PropsWithChildren<HTMLAttributes<HTMLAnchorElement>> {
  token: string;
}

export const TokenAnchor = (props: TokenAnchorProps) => {
  const { token, children, ...other } = props;

  return (
    <Link 
      href={`https://explorer.loopring.io/collections/${token}`}
      underline='hover'
      target='_blank'
      {...other}
    >
      {children ?? truncateAddress(token)}
    </Link>
  );
}