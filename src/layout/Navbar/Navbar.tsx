import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import { formatDistanceStrict } from 'date-fns';
import MenuIcon from '@mui/icons-material/Menu';
import { EthIcon } from '../../components/EthIcon/EthIcon';
import { useMainData } from '../../providers/MainDataProvider';
import { BmacButton } from '../../components/BuyMeACoffee/BmacButton';

export interface NavbarProps extends React.ComponentProps<typeof AppBar> {
  onSidebarToggle: () => void;
}

export const Navbar = (props: NavbarProps) => {
  const { onSidebarToggle, ...other } = props;
  const { updatedAt, volume, trades, lastTransaction } = useMainData();

  const latestTransactionText = formatDistanceStrict(lastTransaction, Date.now());
  const updatedAtText = formatDistanceStrict(updatedAt, Date.now());
  
  return (
    <AppBar
      sx={{
        left: { lg: 240 },
        width: { lg: 'calc(100% - 240px)' },
        backgroundColor: 'background.paper',
      }}
      {...other}
    >
      <Toolbar
        disableGutters
        sx={{
          alignItems: 'stretch',
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <IconButton 
          sx={{
            alignSelf: 'center',
            mr: '6px',
            // move slightly to the left as the icon button has large padding
            ml: '-6px',
            display: {
              xs: 'inherit',
              lg: 'none',
            }
          }}
          onClick={onSidebarToggle}>
          <MenuIcon />
        </IconButton>
        <Box sx={{
          color: 'text.primary',
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          overflowY: 'auto',
          // add small padding to the right to account for the fade effect of the BMAC button
          pr: '40px',
          '& em': {
            color: 'primary.main',
            fontStyle: 'normal',
            fontWeight: 600
          },
          '& .MuiSvgIcon-root': {
            color: 'primary.main',
          },
          '& .MuiTypography-root': {
            marginRight: '10px',
            whiteSpace: 'nowrap',
            lineHeight: '20px',
          },
        }}>
          <Typography variant='caption' sx={{ display: 'flex', alignItems: 'center' }}>
            24h Volume:&nbsp;
            <em>{volume.toFixed(1)}</em>
            <EthIcon />
          </Typography>
          <Typography variant='caption'>24h Trades:<em>&nbsp;{trades}</em></Typography>
          <Typography variant='caption'>Latest trade:<em>&nbsp;{latestTransactionText} ago</em></Typography>
          <Typography variant='caption'>Last update:<em>&nbsp;{updatedAtText} ago</em></Typography>
          
        </Box>
        <Box sx={{ position: 'relative', alignSelf: 'center' }}>
          <BmacButton sx={{ alignSelf: 'center' }} />
          {/* Include a fade on the left side of the button */}
          <Box sx={theme => ({
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.palette.background.paper})`,
            position: 'absolute',
            height: '100%',
            left: 0,
            top: 0,
            width: '60px',
            transform: 'translateX(-100%)',
            pointerEvents: 'none',
          })} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};