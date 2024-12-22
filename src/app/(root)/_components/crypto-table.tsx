'use client';

import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { CryptoData, SortConfig } from '@/types/globals';

import useCrypto from '@/hooks/use-crypto';

import { TABLE_HEADERS } from '@/constants';

import CryptoDetails from './crypto-details';
import TableSearchInput from './table-search-input';

const CryptoTable: FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc'
  });

  const { data, isLoading, error } = useCrypto(sortConfig);

  const handleSort = useCallback((key: string) => {
    setSortConfig((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const filteredCryptoData = useMemo(() => {
    if (!data) return [];

    const searchTermLower = searchTerm.toLowerCase();

    return data.filter(
      ({ name, symbol }: CryptoData) =>
        name.toLowerCase().includes(searchTermLower) ||
        symbol.toLowerCase().includes(searchTermLower)
    ) as CryptoData[];
  }, [data, searchTerm]);

  const handleCryptoClick = useCallback((crypto: CryptoData) => {
    setSelectedCrypto(crypto);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <TableSearchInput
        placeholder="Search by name or symbol..."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {TABLE_HEADERS.map(({ label, key }) => (
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-200"
                  key={key}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortConfig.key === key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCryptoData.map((crypto) => {
              const {
                name,
                symbol,
                quote: { USD }
              } = crypto;

              return (
                <tr
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  key={crypto.id}
                  onClick={() => handleCryptoClick(crypto)}
                >
                  <td className="whitespace-nowrap px-6 py-4">{name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{symbol}</td>
                  <td className="whitespace-nowrap px-6 py-4">${USD.price.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`${
                        USD.percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {USD.percent_change_24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    ${USD.market_cap.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCrypto && (
        <CryptoDetails
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(undefined)}
        />
      )}
    </div>
  );
};

export default CryptoTable;
