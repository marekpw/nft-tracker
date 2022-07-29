import { Drawer, List, styled, useMediaQuery, Theme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { NavItem } from '../NavItem/NavItem';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const StyledLogo = styled('img')(() => ({
  width: '120px',
  padding: '24px 0',
  marginLeft: '40px',
}));

export const Sidebar = (props: SidebarProps) => {
  const { open, onClose } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const content = (
    <>
      <StyledLogo src={process.env.PUBLIC_URL + '/logo-white.png'} />
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <NavItem onClick={onClose} to={'/nfts'} title='Popular NFTs' />
        <NavItem onClick={onClose} to={'/collections'} title='Popular Collections' />
        <NavItem onClick={onClose} to={'/transactions'} title='Transactions' />
        <NavItem onClick={onClose} to={'/statistics'} title='Weekly Statistics' />
        <NavItem onClick={onClose} to={'/settings'} title='Settings' icon={<SettingsIcon />} sx={{ mt: 'auto', mb: '16px' }} />
      </List>
    </>
  )

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 240
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 240
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};