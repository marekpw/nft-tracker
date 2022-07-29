import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar/Sidebar';
import { Footer } from './Footer/Footer';

export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Box component='main' sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexFlow: 'column',
        width: '100%',
        height: '100%',
        pt: '64px',
        pl: {
          lg: '240px'
        }
      }}>
        <Outlet />
        <Footer sx={{ height: '64px', mt: 'auto' }} />
      </Box>
      <Navbar onSidebarToggle={() => setSidebarOpen(open => !open)} />
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};