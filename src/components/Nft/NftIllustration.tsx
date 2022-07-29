import React from 'react';
import { Tooltip, Avatar } from '@mui/material';
import { useNftData } from '../../hooks/useNftData';
import { NftAnchor } from './NftAnchor';
import ImageIcon from '@mui/icons-material/ImageOutlined';

interface NftIllustrationProps extends React.ComponentProps<typeof Avatar> {
  nftId: string;
  displayImage?: boolean;
}

export const NftIllustration = (props: NftIllustrationProps) => {
  const { nftId, sx, displayImage = true, ...other } = props;
  const { image, title } = useNftData(nftId);

  const ipfsLink = (displayImage && image && `https://loopring.mypinata.cloud/ipfs/${image}`) || undefined;
  return (
    <NftAnchor nftId={nftId}>
      <Tooltip title={title}>
        <Avatar src={ipfsLink} variant='rounded' {...other}>
          <ImageIcon />
        </Avatar>
      </Tooltip>
    </NftAnchor>
  );
}