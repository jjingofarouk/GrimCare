// app/layout.jsx
import Sidebar from './Sidebar';
import Header from './Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div style={{ marginTop: '64px', padding: '1rem' }}>
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}