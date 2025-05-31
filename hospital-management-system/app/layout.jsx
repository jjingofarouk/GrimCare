// app/layout.jsx
import Header from './Header';
import './globals.css';

export default function RootLayout({ children }) {
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