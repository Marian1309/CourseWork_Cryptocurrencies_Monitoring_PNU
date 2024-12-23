'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import type { CryptoData, SortConfig } from '@/types/globals';

import { cn } from '@/lib/utils';

import useCrypto from '@/hooks/use-crypto';
import { toast } from '@/hooks/use-toast';

import { useSettings } from '@/context/settings';

import Loader from '@/components/ui/loader';

import { TABLE_HEADERS } from '@/constants';

import CryptoDetails from './crypto-details';
import TablePagination from './table-pagination';
import TableSearchInput from './table-search-input';

type Properties = {
  searchPage: number;
};

const CryptoTable: FC<Properties> = ({ searchPage }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc'
  });

  const { settings } = useSettings();

  const { data, isLoading, error, isRefetching } = useCrypto(
    searchPage,
    sortConfig,
    settings?.refreshInterval || 60_000
  );

  useEffect(() => {
    if (isRefetching) {
      toast({
        title: 'Data updated',
        description: 'The data has been updated.',
        duration: 3000
      });
    }
  }, [isRefetching]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const sortedAndFilteredCryptoData = useMemo(() => {
    if (!data) return [];

    const searchTermLower = searchTerm.toLowerCase();
    const filteredData = data.filter(
      ({ name, symbol }: CryptoData) =>
        name.toLowerCase().includes(searchTermLower) ||
        symbol.toLowerCase().includes(searchTermLower)
    );

    return filteredData.sort((a: CryptoData, b: CryptoData) => {
      if (sortConfig.key === 'name' || sortConfig.key === 'symbol') {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      } else {
        const aValue = a.quote.USD[sortConfig.key as keyof typeof a.quote.USD];
        const bValue = b.quote.USD[sortConfig.key as keyof typeof b.quote.USD];
        return sortConfig.direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [data, searchTerm, sortConfig]);

  const handleCryptoClick = useCallback((crypto: CryptoData) => {
    setSelectedCrypto(crypto);
  }, []);

  if (isLoading)
    return (
      <div className="relative flex-1 flex-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <p className="mb-2 text-2xl font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className={cn(isLoading && 'absolute')}>
      <TableSearchInput
        placeholder="Search by name or symbol..."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {TABLE_HEADERS.map(({ label, key }) => (
                <th
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
                  key={key}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center space-x-1 dark:text-gray-400">
                    <span>{label}</span>
                    {sortConfig.key === key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAndFilteredCryptoData.map((crypto: CryptoData) => {
              const {
                name,
                symbol,
                quote: { USD },
                cmc_rank
              } = crypto;

              return (
                <tr
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  key={crypto.id}
                  onClick={() => handleCryptoClick(crypto)}
                >
                  <td className="whitespace-nowrap px-6 py-4">{cmc_rank}</td>
                  <td className="flex items-center whitespace-nowrap px-6 py-4">
                    <Image
                      alt={name}
                      height={32}
                      src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${crypto.id}.png`}
                      width={32}
                    />
                    <span className="pl-2">{name}</span>
                  </td>
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

      <TablePagination searchPage={searchPage} />
    </div>
  );
};

export default CryptoTable;
