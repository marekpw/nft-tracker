import { Box, Typography, Card, Switch, List, ListItem, ListItemText, ListSubheader, Alert, Radio, RadioGroup, FormControlLabel, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useLocalStorage } from '@rehooks/local-storage';
import { useFtue } from '../hooks/useFtue';
import { ContentWrapper } from './ViewUtils/ContentWrapper';

type AppTheme = 'system' | 'light' | 'dark';

export const Settings = () => {
  const isLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const [gamestopLinks, setGamestopLinks] = useLocalStorage('gamestop_nft_links', false);
  const [popularNftImages, setPopularNftImages] = useLocalStorage('popular_nft_images', true);
  const [collectionImages, setCollectionImages] = useLocalStorage('collection_images', false);
  const [transactionImages, setTransactionImages] = useLocalStorage('transaction_images', false);
  const [theme, setTheme] = useLocalStorage<AppTheme>('theme', 'system');

  const { show: showLinkFtue, acknowledge: acknowledgeLinkFtue } = useFtue('gamestop_nft_links');
  const { show: showImageFtue, acknowledge: acknowledgeImageFtue } = useFtue('images_bandwidth');

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme((event.target as HTMLInputElement).value as AppTheme);
  };

  return (
    <ContentWrapper scrollable>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>Settings</Typography>
      </Box>

      <Card sx={{ mt: '24px', p: '24px' }}>
        <List subheader={<ListSubheader>General</ListSubheader>}>
          <ListItem sx={{ alignItems: 'flex-start' }}>
            <ListItemText primary='Theme' />
            <RadioGroup
              value={theme}
              onChange={handleThemeChange}
              sx={{ ml: 'auto' }}
              row={isLg}
            >
              <FormControlLabel value="system" control={<Radio />} label="System" />
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </ListItem>
          <ListItem>
            <ListItemText primary='Use Gamestop NFT links for NFTs' />
            <Switch
              edge='end'
              checked={gamestopLinks}
              onChange={() => setGamestopLinks(!gamestopLinks)}
            />
          </ListItem>
          {gamestopLinks && showLinkFtue && (
            <ListItem>
              <Alert onClose={acknowledgeLinkFtue} severity='warning' sx={{ width: '100%' }}>
                Gamestop NFT links will work for the majority of NFTs, however NFTs not published on the Gamestop NFT Marketplace will result in a 404 error. <strong>This is not a bug.</strong>
              </Alert>
            </ListItem>
          )}
        </List>
        <List subheader={<ListSubheader>Images</ListSubheader>}>
          {showImageFtue && (
            <ListItem>
              <Alert onClose={acknowledgeImageFtue} severity='info' sx={{ width: '100%' }}>
                NFT images displayed are original size despite being shown as miniatures. Keep them disabled on the Transactions and Popular Collections lists to reduce bandwidth and CPU usage.
              </Alert>
            </ListItem>
          )}
          <ListItem>
            <ListItemText primary='Display NFT images in the Popular NFT list' />
            <Switch
              edge='end'
              checked={popularNftImages}
              onChange={() => setPopularNftImages(!popularNftImages)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary='Display NFT images in the Popular Collections list' />
            <Switch
              edge='end'
              checked={collectionImages}
              onChange={() => setCollectionImages(!collectionImages)}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary='Display NFT images in the Transactions list' />
            <Switch
              edge='end'
              checked={transactionImages}
              onChange={() => setTransactionImages(!transactionImages)}
            />
          </ListItem>
        </List>
      </Card>
    </ContentWrapper>
  );
};