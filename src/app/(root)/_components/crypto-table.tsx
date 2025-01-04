'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import type { DefaultView } from '@prisma/client';
import { Grid, List } from 'lucide-react';
import { useQueryState } from 'nuqs';

import type { CryptoData, SortConfig } from '@/types/globals';

import { CRYPTO_LIMIT_PER_PAGE, TABLE_HEADERS } from '@/constants';

import formatToDollar from '@/lib/format';

import useCrypto from '@/hooks/use-crypto';

import { useSettings } from '@/context/settings';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

import checkUser from '@/actions/check-user';
import getUserBalance from '@/actions/get-balance';

import TablePagination from './table-pagination';
import TableSearchInput from './table-search-input';

const BuyCoinDialog = dynamic(() => import('./buy-coin-dialog'), {
  ssr: false,
  loading: () => <Loader />
});

const CryptoTable = () => {
  const [searchPage, setSearchPage] = useQueryState('search_page', {
    defaultValue: '1',
    clearOnDefault: true
  });
  const [searchTerm, setSearchTerm] = useQueryState('search_term', {
    defaultValue: '',
    clearOnDefault: true
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc'
  });
  const [balance, setBalance] = useState(0);
  const { settings, updateSettings } = useSettings();
  const [view, setView] = useState<DefaultView>(settings?.defaultView || 'LIST');

  const {
    data: response,
    isLoading,
    error,
    isRefetching
  } = useCrypto(
    {
      params: {
        page: searchPage,
        limit: CRYPTO_LIMIT_PER_PAGE,
        searchTerm: searchTerm || undefined
      }
    },
    settings?.refreshInterval || 60_000
  );

  useEffect(() => {
    const fetchBalance = async () => {
      await checkUser();
      const balance = await getUserBalance();
      if (typeof balance === 'number') {
        setBalance(balance);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    if (settings?.defaultView) {
      setView(settings.defaultView);
    }
  }, [settings?.defaultView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchPage, searchTerm]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const sortedCryptoData = useMemo(() => {
    if (!response?.data) return [];

    const compareValues = (a: CryptoData, b: CryptoData) => {
      const { key, direction } = sortConfig;
      if (key === 'name' || key === 'symbol') {
        return direction === 'asc'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else {
        const aValue = Number.parseFloat(a[key as keyof CryptoData] as string);
        const bValue = Number.parseFloat(b[key as keyof CryptoData] as string);
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
    };

    return [...(response?.data || [])].sort(compareValues);
  }, [response, sortConfig]);

  const toggleView = useCallback(async () => {
    const newView = view === 'LIST' ? 'GRID' : 'LIST';
    setView(newView);
    await updateSettings({ defaultView: newView });
  }, [view, updateSettings]);

  if (isLoading) {
    return (
      <div className="relative mt-4 flex-1 flex-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <p className="mb-2 text-2xl font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 flex items-center justify-between pb-4">
        <TableSearchInput
          className="flex-1"
          placeholder="Search by name or symbol..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="cursor-pointer p-2" onClick={toggleView}>
          {view === 'LIST' ? <Grid className="h-6 w-6" /> : <List className="h-6 w-6" />}
        </div>
      </div>

      {view === 'LIST' ? (
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
              {sortedCryptoData.map((crypto: CryptoData) => {
                const { name, symbol, price, rank, percent_change_24h, market_cap } =
                  crypto;

                const formattedPrice = formatToDollar(price);
                const formattedMarketCap = formatToDollar(market_cap);

                return (
                  <tr
                    className="cursor-pointer transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    key={crypto.id}
                  >
                    <td className="whitespace-nowrap px-6 py-4">{rank}</td>
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
                    <td className="whitespace-nowrap px-6 py-4">{formattedPrice}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`${
                          percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {percent_change_24h}%
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{formattedMarketCap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedCryptoData.map((crypto: CryptoData) => {
            const { name, symbol, rank, percent_change_24h, market_cap, price } = crypto;

            const formattedPrice = formatToDollar(price);
            const formattedMarketCap = formatToDollar(market_cap);

            return (
              <Card
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                key={crypto.id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {name} ({symbol})
                  </CardTitle>

                  <Image
                    alt={name}
                    height={32}
                    src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${crypto.id}.png`}
                    width={32}
                  />
                </CardHeader>

                <CardContent className="flex items-end justify-between">
                  {isRefetching ? (
                    <Loader />
                  ) : (
                    <div>
                      <div className="text-2xl font-bold">{formattedPrice}</div>
                      <p
                        className={`pt-2 text-xs ${
                          percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {percent_change_24h}%
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Rank: {rank}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Market Cap: {formattedMarketCap}
                      </p>
                    </div>
                  )}

                  <BuyCoinDialog
                    balance={balance}
                    coinId={crypto.id.toString()}
                    coinName={name}
                    coinPrice={price}
                    coinSymbol={symbol}
                    isRefetching={isRefetching}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TablePagination
        onPageChange={(page) => setSearchPage(page.toString())}
        searchPage={searchPage}
        totalItems={response?.pagination?.totalPages || 0}
      />
    </>
  );
};

export default CryptoTable;
