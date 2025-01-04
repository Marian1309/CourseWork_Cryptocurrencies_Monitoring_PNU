'use client';

import { Fragment, useEffect, useState } from 'react';

import Image from 'next/image';

import { Trash } from 'lucide-react';

import prettyPrint from '@/lib/pretty-print';

import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import getCoinData from '@/actions/get-coin-data';
import getUserCoins from '@/actions/get-user-coins';

import BuyMoreDialog from './sell-dialog';

type Coin = {
  symbol: string;
  boughtPrice: number;
  amount: number;
  currentPrice: number;
  value: number;
  coinId: string;
  name: string;
};

const PortfolioTable = () => {
  const [{ loading, data }, setState] = useState<{ loading: boolean; data: Coin[] }>({
    loading: true,
    data: []
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const coins = await getUserCoins();

        const coinDataResults = await Promise.all(
          coins?.map((coin) => getCoinData(coin.symbol)) || []
        );
        const coinDataMap = coinDataResults.reduce<Record<string, any>>(
          (map, data, index) => {
            const symbol = coins?.[index]?.symbol;
            if (symbol) {
              map[symbol] = {
                ...data,
                coinId: coins?.[index]?.coinId
              };
            }
            return map;
          },
          {}
        );

        const portfolio = coins?.map((coin) => ({
          name: coin.name,
          symbol: coin.symbol,
          boughtPrice: coin.boughtPrice,
          amount: coin.amount,
          currentPrice: coinDataMap[coin.symbol]?.[coin.symbol]?.quote?.USD?.price || 0,
          value: coin.boughtPrice * coin.amount,
          coinId: coinDataMap[coin.symbol].coinId
        }));

        setState({ loading: false, data: portfolio || [] });
      } catch (error) {
        prettyPrint.error(error);
        setState((state) => ({ ...state, loading: false }));
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="relative flex-1 flex-center">
        <Loader />
      </div>
    );
  }

  const totalValue = data.reduce((sum, { value }) => sum + (value || 0), 0);

  const calculateChange = (currentPrice: number, boughtPrice: number) => {
    const percentage = (((currentPrice - boughtPrice) / boughtPrice) * 100).toFixed(1);

    if (percentage === '0.0' || percentage === '-0.0') {
      return <span className="text-gray-500">0.0%</span>;
    }

    return +percentage > 0 ? (
      <span className="text-green-600">+{percentage}%</span>
    ) : (
      <span className="text-red-600">{percentage}%</span>
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Bought Price</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Percentage</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map(
            ({ symbol, name, amount, boughtPrice, currentPrice, value, coinId }) => {
              return (
                <Fragment key={symbol}>
                  <TableRow>
                    <TableCell className="flex items-center gap-x-2">
                      <Image
                        alt={symbol}
                        height={32}
                        src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${coinId}.png`}
                        width={32}
                      />
                      {name}
                    </TableCell>
                    <TableCell>{amount}</TableCell>
                    <TableCell>${boughtPrice?.toFixed(3)}</TableCell>
                    <TableCell>${currentPrice?.toFixed(3)}</TableCell>
                    <TableCell>${value?.toFixed(3)}</TableCell>
                    <TableCell>{calculateChange(currentPrice, boughtPrice)}</TableCell>
                    <TableCell>
                      <Button
                        className="flex cursor-pointer items-center gap-x-2 text-red-500"
                        onClick={() => setIsOpen(true)}
                        variant="outline"
                      >
                        <Trash className="h-4 w-4" />
                        <span>Sell</span>
                      </Button>
                    </TableCell>
                  </TableRow>

                  <BuyMoreDialog
                    coin={{ name, symbol, amount, price: currentPrice, id: coinId }}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                  />
                </Fragment>
              );
            }
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex gap-x-2">
        <div className="font-bold">Total Portfolio Value:</div>
        <span className="font-bold">${totalValue.toFixed(3)}</span>
      </div>
    </>
  );
};

export default PortfolioTable;
