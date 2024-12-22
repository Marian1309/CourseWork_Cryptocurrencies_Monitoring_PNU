import type { FC, ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Navbar from '@/components/layout/navbar';

import Providers from './providers';

import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter'
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https:crypto-monitor.pidchashyi.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Crypto Monitor | Real-time Cryptocurrency Tracking',
    template: '%s | Crypto Monitor'
  },
  description:
    'Track cryptocurrency prices, manage your portfolio, and stay updated with the latest crypto news in real-time.',
  keywords: [
    'cryptocurrency',
    'crypto',
    'bitcoin',
    'ethereum',
    'blockchain',
    'trading',
    'investment',
    'finance'
  ],
  authors: [{ name: 'Crypto Monitor Team' }],
  creator: 'Crypto Monitor',
  publisher: 'Crypto Monitor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  }
};

type Properties = {
  children: ReactNode;
};

const RootLayout: FC<Properties> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <Providers className="flex-1 overflow-y-auto bg-gray-100 pt-12">
            <div className="mx-auto max-w-7xl">{children}</div>
          </Providers>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
