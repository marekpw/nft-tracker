import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ContentWrapper } from './ViewUtils/ContentWrapper';
import { L2AddressLink } from '../components/L2AddressLink/L2AddressLink';

const FaqSection = (props: React.PropsWithChildren<{ title: string }>) => {
  const { title, children } = props;

  return (
    <Card sx={{ mt: '24px' }}>
      <CardContent>
        <Typography variant='subtitle1'>{title}</Typography>
        <Typography variant='body2'>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const FrequentlyAsked = () => {
  return (
    <ContentWrapper scrollable>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4'>Frequently Asked Questions</Typography>
      </Box>
      <FaqSection title='Is LoopNFT.net affiliated with Loopring?'>
        LoopNFT is not affiliated with Loopring. It's a completely separate application that uses the same APIs as Loopring Explorer to get transaction and NFT data.
      </FaqSection>
      <FaqSection title='How does it work?'>
        LoopNFT works by using TheGraph to scan transactions and Ethereum L1 to obtain NFT metadata. The data is then saved to JSON.
        When you use LoopNFT, your browser makes a request to load this JSON file and displays the information in a user friendly way.
      </FaqSection>
      <FaqSection title='How often is data updated?'>
        The NFT trade scanner runs once every 20 minutes and pulls in the latest transactions.
      </FaqSection>
      <FaqSection title='How much data is stored?'>
        Currently, transactions old up to 7 days are parsed and stored in a database.
      </FaqSection>
      <FaqSection title="Why don't links go to the Gamestop NFT Marketplace?">
        Keep in mind that LoopNFT is first and foremost a Loopring network tracker, not a Gamestop Marketplace tracker. There can be NFTs visible here which are not available on the Gamestop Marketplace.
        However, for convenience, I have added an experimental feature to point NFT links to the Gamestop Marketplace instead. Just enable it in the <Link component={RouterLink} to='/settings'>Settings</Link>.
      </FaqSection>
      <FaqSection title="Is this project open source?">
        LoopNFT is available on GitHub: <Link href='https://github.com/marekpw/nft-tracker' target='_blank'>marekpw/nft-tracker</Link>
      </FaqSection>
      <FaqSection title="Is there any way I can help?">
        This application takes effort to develop and is not free to run. The money needed to run it is paid out of my own pocket. If you think this application has helped you and you wish to support me and future development,
        please consider donating either by clicking the "Buy me a coffee" button in the top right or by sending L2 LRC directly to <L2AddressLink sx={{ mb: '2px' }}>marekpw.loopring.eth</L2AddressLink>.
        <br /><br />
        In the future, I am considering to allow supporters to vote on roadmap items.
      </FaqSection>
    </ContentWrapper>
  );
};