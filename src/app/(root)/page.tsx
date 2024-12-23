import type { NextPage } from 'next';
import { redirect } from 'next/navigation';

import CryptoTable from './_components/crypto-table';

type Properties = {
  searchParams: {
    searchPage: string;
  };
};

const HomePage: NextPage<Properties> = ({ searchParams }) => {
  if (!searchParams.searchPage) {
    redirect(`/?searchPage=1`);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 bg-white p-4 dark:bg-gray-800">
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Welcome to Crypto Monitor. This dashboard provides real-time information
              about various cryptocurrencies. Click on a row to see more details about a
              specific cryptocurrency.
            </p>

            <CryptoTable searchPage={+searchParams.searchPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
