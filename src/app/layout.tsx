import type { FC, ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

import Navbar from '@/components/layout/navbar';
import Loader from '@/components/ui/loader';

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

const RootLayout: FC<Properties> = async ({ children }) => {
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.variable}>
          <div className="flex min-h-screen flex-col">
            <ClerkLoading>
              <Loader className="min-h-screen text-2xl flex-center" size={40} />
            </ClerkLoading>

            <ClerkLoaded>
              <Navbar isSignedIn={!!user} />

              <Providers className="flex-1 overflow-y-auto bg-gray-100 pt-12 dark:bg-gray-900">
                <div className="mx-auto">{children}</div>
              </Providers>
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
