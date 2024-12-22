import type { FC, ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
