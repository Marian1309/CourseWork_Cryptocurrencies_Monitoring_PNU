import type { FC } from 'react';

import type { CryptoData } from '@/types/globals';

type CryptoDetailsProperties = {
  crypto: CryptoData;
  onClose: () => void;
};

const CryptoDetails: FC<CryptoDetailsProperties> = ({ crypto, onClose }) => {
  if (!crypto) return;

  const {
    name,
    symbol,
    quote: { USD },
    circulating_supply,
    cmc_rank
  } = crypto;

  return (
    <div
      className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {name} ({symbol})
          </h3>

          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">Rank: {cmc_rank}</p>
            <p className="text-sm text-gray-500">Price: ${USD.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              Market Cap: ${USD.market_cap.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              24h Change:
              <span
                className={USD.percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'}
              >
                {USD.percent_change_24h.toFixed(2)}%
              </span>
            </p>

            <p className="text-sm text-gray-500">
              7d Change:
              <span
                className={USD.percent_change_7d > 0 ? 'text-green-600' : 'text-red-600'}
              >
                {USD.percent_change_7d.toFixed(2)}%
              </span>
            </p>

            <p className="text-sm text-gray-500">
              Volume (24h): ${USD.volume_24h.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              Circulating Supply: {circulating_supply.toLocaleString()} {symbol}
            </p>
          </div>

          <div className="items-center px-4 py-3">
            <button
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              id="ok-btn"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
