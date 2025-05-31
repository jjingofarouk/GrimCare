import { requireAuth } from './auth/authUtils';
import Header from './Header';
import './globals.css';

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ marginTop: '64px', padding: '1rem' }}>
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

export default requireAuth(RootLayout);