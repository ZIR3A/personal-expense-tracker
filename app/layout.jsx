import './globals.css';
import { ToastContainer } from '../components/ui/Toast';

export const metadata = {
  title: 'NS Finance Tracker',
  description: 'Futuristic income/expense tracker with 3D visuals'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}