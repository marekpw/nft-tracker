import { Button, Link, useMediaQuery, Theme } from '@mui/material';
import { BmacIcon } from './BmacIcon';

export const BmacButton = (props: React.ComponentProps<typeof Link>) => {
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const button = isLg
    ? (
      <Button
        startIcon={<BmacIcon />}
        variant='outlined'
        size='small'
        color='warning'
      >
        Buy me a coffee
      </Button>
    )
    : (
      <Button variant='outlined' color='warning' sx={{ minWidth: '24px', p: '6px 12px' }}>
        <BmacIcon />
      </Button>
    )

  return (
    <Link href='https://www.buymeacoffee.com/marekpw' underline='none' target='_blank' {...props}>
      {button}
    </Link>
  );
};