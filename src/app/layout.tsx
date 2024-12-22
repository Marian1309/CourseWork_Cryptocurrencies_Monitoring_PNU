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

export const metadata: Metadata = {
  title: 'Cryptocurrency Monitoring App',
  description: 'Monitor cryptocurrency prices and market data'
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
