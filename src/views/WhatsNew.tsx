import { Box, Typography, Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';
import { ContentWrapper } from './ViewUtils/ContentWrapper';

export const LATEST_VERSION = 'v1.1';

const UpdateSection = (props: React.PropsWithChildren<{ version: string, date: Date }>) => {
  const { version, date, children } = props;

  return (
    <Card sx={{ mt: '24px' }}>
      <CardHeader
        titleTypographyProps={{ color: 'success.main' }}
        title={`Version ${version}`}
        subheader={format(date, 'EEEE, MMMM do yyyy')}
      />
      <CardContent>
        <Typography variant='body2'>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const WhatsNew = () => {
  return (
    <ContentWrapper scrollable>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>What's New</Typography>
      </Box>
      <UpdateSection version='1.1' date={new Date('Aug 2 2022')}>
        <Typography variant='subtitle1'>Fixed Volume/Fees Counting</Typography>
        <Typography variant='body2'>
          The volume summary used to include LRC trades as ETH which made the weekly volume statistics highly inaccurate. This has been fixed.
          Additionally, fees, which previously included royalties as well, have been split into Network fees, Marketplace fees and Royalties.
        </Typography>

        <Typography variant='subtitle1' sx={{ mt: '16px' }}>More Data in Weekly Statistics</Typography>
        <Typography variant='body2'>
          Weekly Statistics now have more data, including the ratio of Gamestop trades to all trades on the network.
          To identify which trades happened on the Gamestop Marketplace, the fee percentage is checked to be 2.25%. 
        </Typography>

        <Typography variant='subtitle1' sx={{ mt: '16px' }}>Trade Ranges, Update Interval</Typography>
        <Typography variant='body2'>
          Hourly trade ranges were not very useful and could easily include only a single data point.
          Because of this, the 1hr/6hr trade ranges have been changed to 3hr and 12hr respectively. The update interval has also been changed to 10 minutes to catch new trades sooner.
        </Typography>
      </UpdateSection>
      <UpdateSection version='1.0' date={new Date('Jul 30 2022')}>
        <Typography variant='subtitle1'>Weekly Statistics</Typography>
        <Typography variant='body2'>
          LoopNFT now provides weekly statistics of the NFT trades done on the Loopring L2 network. These can be used to get a glimpse of the weekly volume, trades and fees collected across the entire network.
          You can find this feature in the left menu.
        </Typography>

        <Typography variant='subtitle1' sx={{ mt: '16px' }}>Weekly Data in Popular NFTs and Collections</Typography>
        <Typography variant='body2'>
          If a 24 hour trading window was not enough data to get a full picture of which NFTs and collections are trending, LoopNFT now provides a 7 day trading window as well.
          Go to either Popular NFTs or Popular Collections and select the 7 day time range from the time selector above the table.
        </Typography>
        
        <Typography variant='subtitle1' sx={{ mt: '16px' }}>Dark Mode</Typography>
        <Typography variant='body2'>
          Found the default light mode too bright, especially when it blinds you in the middle of the night? Dark mode solves this problem. Enable it in the Settings. The default value is system based,
          meaning there's a good chance you already see dark mode by default if that's what your system uses.
        </Typography>

        <Typography variant='subtitle1' sx={{ mt: '16px' }}>Better Charts</Typography>
        <Typography variant='body2'>
          The charts in Popular NFTs have been greatly improved. Styling, formatting and animations have been improved. A new Volume data type has been added.
          The various charts can be switched using the cog icon in the top right corner above the table. In addition, the same charts are now available in Popular Collections.
        </Typography>

        <Typography variant='subtitle1' sx={{ mt: '16px' }}>Miscellaneous</Typography>
        <Typography variant='body2'>
          <Box component='ul' sx={{ ml: '16px' }}>
            <li>Time range/chart type selections now persist in local storage meaning you don't have to reselect them each time</li>
            <li>Chart type selection is now also available in mobile versions of the app</li>
            <li>Transactions table now lists up to 1000 latest transactions</li>
            <li>Transactions table now also lists the fee for each transaction</li>
            <li>Added a What's new page that lists the changelog (which you're currently viewing)</li>
            <li>Removed "Oldest trade" from the top header</li>
            <li>Added 24h trades to the top header</li>
            <li>Fixed the default sort in tables not showing up, making it hard to see that tables are possible to sort</li>
            <li>Removed the option to display line in charts from the settings. Lines have been added by default with the points hidden to make a smoother line</li>
            <li>It is now possible to filter NFTs/Collections by a threshold of minimum trades, which can then be used together with table sorting</li>
            <li>Greatly reduced bandwidth usage by sampling the data in the backend instead of keeping a list of all transactions and parsing it in the client</li>
            <li>Added a ≈ symbol before USD prices to emphasize that the price was not calculated during the actual trade but may fluctuate based on the current value of ETH</li>
          </Box>
        </Typography>
      </UpdateSection>
      <UpdateSection version='0.1 (alpha)' date={new Date('Jul 23 2022')}>
        <Typography variant='body2'>
          Initial public release
        </Typography>
      </UpdateSection>
    </ContentWrapper>
  );
};