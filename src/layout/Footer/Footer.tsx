import { ComponentProps } from 'react';
import { Box, Link, Badge } from '@mui/material';
import { useLocalStorage } from '@rehooks/local-storage';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { LATEST_VERSION } from '../../views/WhatsNew';
import { L2AddressLink } from '../../components/L2AddressLink/L2AddressLink';

export const Footer = (props: Partial<ComponentProps<typeof Box>>) => {
  // TODO: change the default to LATEST_VERSION after the most major features are done
  const [lastVersionChecked, setLastVersionChecked] = useLocalStorage('last_version_checked', '0.0');
  const calloutNew = lastVersionChecked !== LATEST_VERSION;

  const heartIcon = <FavoriteIcon sx={theme => ({ width: '16px', height: '16px', mt: '1px', fill: theme.palette.primary.light })} />;
  return (
    <>
      <Box
        {...props}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '12px 24px',
          color: 'text.secondary',
          '& .MuiLink-root': {
            mr: '8px',
          },
          ...props.sx,
        }}
      >
        <Link component={RouterLink} variant='caption' to='/faq' color='text.secondary'>FAQ</Link>
        <Link component={RouterLink} variant='caption' to='/news' color={calloutNew ? 'success.main' : 'text.secondary'} onClick={() => {
          setLastVersionChecked(LATEST_VERSION);
        }}>
          What's New
          {calloutNew && (
            <Badge color='success' variant='dot' sx={{ left: '6px', bottom: '6px' }} />
          )}
        </Link>

        <L2AddressLink color='text.secondary' sx={{ mr: '6px', ml: 'auto' }}>marekpw.loopring.eth</L2AddressLink>
        {heartIcon}
      </Box>
    </>
  );
}
