'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Eye, Loader2, MoreHorizontal, Trash } from 'lucide-react';

import { toast } from '@/hooks/use-toast';

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
import sellCoin from '@/actions/sell-coin';

type Coin = {
  symbol: string;
  boughtPrice: number;
  amount: number;
  currentPrice: number;
  value: number;
  coinId: string;
  name: string;
};

const PortfolioTable: FC = () => {
  const [{ loading, data }, setState] = useState<{ loading: boolean; data: Coin[] }>({
    loading: true,
    data: []
  });

  const router = useRouter();

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
          name: coin.name,
          symbol: coin.symbol,
          boughtPrice: coin.boughtPrice,
          amount: coin.amount,
          currentPrice: coinDataMap[coin.symbol]?.[coin.symbol]?.quote?.USD?.price || 0,
          value: coin.boughtPrice * coin.amount,
          coinId: coinDataMap[coin.symbol].coinId
        }));

        setState({ loading: false, data: portfolio });
      } catch (error) {
        console.error('Error:', error);
        setState((state) => ({ ...state, loading: false }));
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalValue = data.reduce((sum, { value }) => sum + (value || 0), 0);

  const calculateChange = (currentPrice: number, boughtPrice: number) => {
    const percentage = (((currentPrice - boughtPrice) / boughtPrice) * 100).toFixed(1);

    return +percentage > 0 ? (
      <span className="text-green-600">+{percentage}%</span>
    ) : (
      <span className="text-red-600">{percentage}%</span>
    );
  };

  const sell = async ({ coinId, amount, currentPrice, symbol }: any) => {
    await sellCoin({ coinId, amount, soldPrice: currentPrice });
    router.refresh();
    toast({
      title: `You sold ${amount} ${symbol}${amount > 1 ? 's' : ''}`,
      description: 'Your balance has been updated'
    });
  };

  return (
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
              <TableCell>{calculateChange(currentPrice, boughtPrice)}</TableCell>
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
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => sell({ coinId, amount: 1, currentPrice, symbol })}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="mx-2">Sell</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        )}

        <TableRow>
          <div className="pt-6 text-lg">
            <TableCell className="font-bold" colSpan={4}>
              Total Portfolio Value:
            </TableCell>
            <TableCell className="font-bold">${totalValue.toFixed(3)}</TableCell>
          </div>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PortfolioTable;
