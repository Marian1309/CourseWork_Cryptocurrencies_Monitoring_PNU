import type { NextPage } from 'next';

import CryptoTable from './_components/crypto-table';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 pb-6 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 bg-white p-4">
            <p className="mb-4 text-gray-500">
              Welcome to Crypto Monitor. This dashboard provides real-time information
              about various cryptocurrencies. Click on a row to see more details about a
              specific cryptocurrency.
            </p>

            <CryptoTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
