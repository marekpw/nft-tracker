import { ThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';
import { Chart as ChartJS, registerables } from 'chart.js';
// @ts-ignore
import useSystemTheme from 'react-use-system-theme';
import 'react-chartjs-2'

import { theme as lightTheme } from './theme/theme';
import { darkTheme } from './theme/darkTheme';
import { MainLayout } from './layout/MainLayout';
import { ExchangeRateProvider } from './providers/ExchangeRateProvider';
import { MainDataProvider } from './providers/MainDataProvider';
import { PopularNfts } from './views/PopularNfts';
import { PopularCollections } from './views/PopularCollections';
import { Transactions } from './views/Transactions';
import { Settings } from './views/Settings';
import { FrequentlyAsked } from './views/FrequentlyAsked';
import { Statistics } from './views/Statistics';
import { WhatsNew } from './views/WhatsNew';

ChartJS.register(...registerables);

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Navigate to='/nfts' />} />
          <Route path='nfts' element={<PopularNfts />} />
          <Route path='collections' element={<PopularCollections />} />
          <Route path='transactions' element={<Transactions />} />
          <Route path='statistics' element={<Statistics />} />
          <Route path='settings' element={<Settings />} />
          <Route path='faq' element={<FrequentlyAsked />} />
          <Route path='news' element={<WhatsNew />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const [preferredTheme] = useLocalStorage('theme', 'system');
  const systemTheme = useSystemTheme();

  let themeToUse: Theme = lightTheme;
  if (preferredTheme === 'system') {
    themeToUse = systemTheme === 'dark' ? darkTheme : lightTheme;
  } else {
    themeToUse = preferredTheme === 'dark' ? darkTheme : lightTheme;
  }

  return (
    <MainDataProvider>
      <ExchangeRateProvider>
        <ThemeProvider theme={themeToUse}>
          <CssBaseline />
            <AppContent />
        </ThemeProvider>
      </ExchangeRateProvider>
    </MainDataProvider>
  );
};

export default App;
