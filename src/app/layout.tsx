import type { FC, ReactNode } from 'react';

import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import Providers from './providers';

import './globals.scss';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-figtree'
});

export const metadata: Metadata = {
  title: 'Next.js 14 Starter App',
  description: 'Next.js 14 Basic Starter App'
};

type Properties = {
  children: ReactNode;
};

const RootLayout: FC<Properties> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={figtree.variable}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
