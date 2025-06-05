import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

export default function RootLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar isOpen={true} toggleSidebar={() => {}} />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}