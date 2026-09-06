import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Musein mobile welcome',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, minimumScale: 1,
  maximumScale: 5, userScalable: true, viewportFit: 'cover', themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Same optional fonts as the reviewed site; system fonts remain the fallback. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
