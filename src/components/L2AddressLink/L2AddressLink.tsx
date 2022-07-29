import { useState, MouseEvent } from 'react';
import { Link, LinkProps, Card, Popover, Typography } from '@mui/material';
import { QR_CODE_BASE64 } from './qrCodeBase64';

export interface L2AddressLinkPros extends LinkProps {}

export const L2AddressLink = (props: L2AddressLinkPros) => {
  const [addressAnchor, setAddressAnchor] = useState<HTMLButtonElement | null>(null);
  const handleAddressClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAddressAnchor(event.currentTarget);
  };

  const handleAddressClose = () => {
    setAddressAnchor(null);
  };
  return (
    <>
      <Link
        component={'button' as any}
        onClick={handleAddressClick as any}
        {...props}
      />
      <Popover
        open={Boolean(addressAnchor)}
        anchorEl={addressAnchor}
        onClose={handleAddressClose}
        keepMounted
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Card sx={{
          width: '275px',
          p: '12px',
          textAlign: 'center',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'center'
        }}>
          <Typography variant='subtitle1' color='primary.main' sx={{ textTransform: 'uppercase' }}>Support LoopNFT</Typography>
          <Typography variant='body2' sx={{ mb: '12px' }} color='text.secondary'>If this app helped you, consider supporting future development by sending L2 LRC/ETH to this address:</Typography>
          <img alt='QR Code' src={QR_CODE_BASE64} style={{ width: '180px' }} />
          <Typography variant='overline' color='text.secondary'>marekpw.loopring.eth</Typography>
        </Card>
      </Popover>
    </>
  )
}