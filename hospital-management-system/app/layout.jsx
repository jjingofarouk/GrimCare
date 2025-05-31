// app/layout.js or app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Hospital Management System',
  description: 'Manage hospital operations efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}