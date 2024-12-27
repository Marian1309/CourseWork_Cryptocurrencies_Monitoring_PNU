'use client';

import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { Grid, List } from 'lucide-react';
import { useQueryState } from 'nuqs';

import type { CryptoData, SortConfig } from '@/types/globals';

import useCrypto from '@/hooks/use-crypto';
import { toast } from '@/hooks/use-toast';

import { useSettings } from '@/context/settings';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

import checkUser from '@/actions/check-user';
import getUserBalance from '@/actions/get-balance';
import { TABLE_HEADERS } from '@/constants';

import BuyCoinDialog from './buy-coin-dialog';
import CryptoDetails from './crypto-details';
import TablePagination from './table-pagination';
import TableSearchInput from './table-search-input';

const CryptoTable: FC = () => {
  const [searchPage, setSearchPage] = useQueryState('search_page', { defaultValue: '1' });

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap',
    direction: 'desc'
  });
  const [balance, setBalance] = useState(0);
  const { settings, updateSettings } = useSettings();
  const [view, setView] = useState(settings?.defaultView || 'list');
  const { data, isLoading, error, isRefetching, refetch } = useCrypto(
    searchPage,
    sortConfig,
    settings?.refreshInterval || 60_000
  );

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getUserBalance();
      if (typeof balance === 'number') {
        setBalance(balance);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const isRegistered = localStorage.getItem('isRegistered');
    if (!isRegistered) {
      checkUser();
      localStorage.setItem('isRegistered', 'true');
    }
  }, []);

  useEffect(() => {
    if (settings?.defaultView) {
      setView(settings.defaultView);
    }
  }, [settings?.defaultView]);

  useEffect(() => {
    if (isRefetching) {
      toast({
        title: 'Data updated',
        description: 'The data has been updated.',
        duration: 1500
      });
    }
  }, [isRefetching]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refetch();
  }, [refetch, searchPage]);

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 800) {
      setView('grid');
    } else {
      setView('list');
    }
  });

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

  const toggleView = useCallback(async () => {
    const newView = view === 'list' ? 'grid' : 'list';
    setView(newView);
    await updateSettings({ defaultView: newView });
  }, [view, updateSettings]);

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
    <>
      <div className="flex items-center justify-between pb-4">
        <TableSearchInput
          className="flex-1"
          placeholder="Search by name or symbol..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="cursor-pointer p-2" onClick={toggleView}>
          {view === 'list' ? <Grid className="h-6 w-6" /> : <List className="h-6 w-6" />}
        </div>
      </div>

      {view === 'list' ? (
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
                    <td className="whitespace-nowrap px-6 py-4">
                      ${USD.price.toFixed(2)}
                    </td>
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
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAndFilteredCryptoData.map((crypto: CryptoData) => {
            const {
              id,
              name,
              symbol,
              quote: { USD },
              cmc_rank
            } = crypto;
            return (
              <Card
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                key={id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {name} ({symbol})
                  </CardTitle>

                  <Image
                    alt={name}
                    height={32}
                    src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${id}.png`}
                    width={32}
                  />
                </CardHeader>

                <CardContent className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">${USD.price.toFixed(2)}</div>
                    <p
                      className={`text-xs ${USD.percent_change_24h > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {USD.percent_change_24h.toFixed(2)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Rank: {cmc_rank}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Market Cap: ${USD.market_cap.toLocaleString()}
                    </p>
                  </div>

                  <BuyCoinDialog
                    balance={balance}
                    coinId={id.toString()}
                    coinName={name}
                    coinPrice={USD.price}
                    coinSymbol={symbol}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedCrypto && (
        <CryptoDetails
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(undefined)}
        />
      )}

      <TablePagination
        onPageChange={(page) => setSearchPage(page.toString())}
        searchPage={searchPage}
      />
    </>
  );
};

export default CryptoTable;
