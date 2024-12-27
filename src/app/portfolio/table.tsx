'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { Eye, Loader2, MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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

  useEffect(() => {
    (async () => {
      try {
        const coins = await getUserCoins();

        const coinDataResults = await Promise.all(
          coins.map((coin) => getCoinData(coin.symbol))
        );

        const coinDataMap = coinDataResults.reduce((map, data, index) => {
          map[coins[index].symbol] = {
            ...data,
            coinId: coins[index].coinId
          };
          return map;
        }, {});

        const portfolio = coins.map((coin) => ({
          symbol: coin.symbol,
          boughtPrice: coin.boughtPrice,
          amount: coin.amount,
          currentPrice: coinDataMap[coin.symbol]?.[coin.symbol]?.quote?.USD?.price || 0,
          value: coin.boughtPrice * coin.amount,
          coinId: coinDataMap[coin.symbol].coinId,
          name: coin.name
        }));

        setState({ loading: false, data: portfolio });
      } catch (error) {
        console.error('Error:', error);
        setState((state) => ({ ...state, loading: false }));
      }
    })();
  }, []);

  if (loading) return <Loader2 className="h-8 w-8 animate-spin" />;

  const totalValue = data.reduce((sum, { value }) => sum + (value || 0), 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Bought Price</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map(
          ({ symbol, name, amount, boughtPrice, currentPrice, value, coinId }) => (
            <TableRow key={symbol}>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 p-0" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4" />
                      <span className="mx-2">Buy more</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash className="h-4 w-4" />
                      <span className="mx-2">Sell permanently</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        )}
        <TableRow>
          <TableCell className="font-bold" colSpan={3}>
            Total Portfolio Value
          </TableCell>
          <TableCell className="font-bold">${totalValue.toFixed(2)}</TableCell>
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PortfolioTable;
