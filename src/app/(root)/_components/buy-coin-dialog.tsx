'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeInfo } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { COMMISSION_PERCENT, COMMISSION_PER_COIN } from '@/constants';

import { toast } from '@/hooks/use-toast';

import type { BuyCoinSchema } from '@/schemas/but-coin';
import { buyCoinSchema } from '@/schemas/but-coin';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';

import buyCoin from '@/actions/buy-coin';

type BuyCoinDialogProperties = {
  coinName: string;
  coinPrice: number;
  coinSymbol: string;
  balance: number;
  coinId: string;
  isRefetching: boolean;
};

const BuyCoinDialog = ({
  coinName,
  coinPrice,
  coinSymbol,
  balance,
  coinId,
  isRefetching
}: BuyCoinDialogProperties) => {
  const [{ open, isSubmitting }, setBuyDialog] = useState({
    open: false,
    isSubmitting: false
  });
  const [totalCost, setTotalCost] = useState(0);

  const form = useForm<BuyCoinSchema>({
    resolver: zodResolver(buyCoinSchema),
    defaultValues: {
      coinName,
      amount: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const amount = Number.parseFloat(value.amount as string) || 0;
      const commission = amount * COMMISSION_PER_COIN + amount * coinPrice * 0.05;
      const percent = amount == 0 ? 0 : COMMISSION_PERCENT;
      setTotalCost(amount * coinPrice + commission + percent);
    });

    return () => subscription.unsubscribe();
  }, [form, coinPrice]);

  const handleBuyCoin = async (data: BuyCoinSchema) => {
    setBuyDialog((previous) => ({ ...previous, isSubmitting: true }));

    try {
      const result = await buyCoin({
        name: coinName,
        amount: +data.amount,
        symbol: coinSymbol,
        price: coinPrice,
        id: coinId
      });

      if (result?.message) {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });

        return;
      }

      form.reset();
      setBuyDialog((previous) => ({ ...previous, open: false }));

      toast({
        title: 'Coin purchased',
        description: `You've bought ${data.amount} ${coinName}.`
      });
    } catch {
      toast({
        title: 'Error',
        description: 'There was an error while purchasing the coin.',
        variant: 'destructive'
      });
    } finally {
      setBuyDialog((previous) => ({ ...previous, isSubmitting: false }));
    }
  };

  return (
    <Dialog
      onOpenChange={() =>
        setBuyDialog((previous) => ({ ...previous, open: !previous.open }))
      }
      open={open}
    >
      <DialogTrigger asChild>
        <Button disabled={isRefetching} variant="outline">
          Buy Coin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Buy Cryptocurrency ( {balance.toFixed(2)} $ available )
          </DialogTitle>

          <DialogDescription>
            Enter the amount of {coinName} you want to buy.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleBuyCoin)}>
            <FormField
              control={form.control}
              name="coinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coin Name</FormLabel>
                  <FormControl>
                    <Input disabled placeholder={coinName} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      max={1_000_000}
                      min={0}
                      placeholder="Enter amount"
                      step={0.5}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!flex !items-center !justify-between">
              <HoverCard>
                <div className="flex items-center gap-2">
                  Total Cost with tax: ${totalCost.toFixed(4)}
                  {form.watch('amount') && (
                    <HoverCardTrigger className="flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4" />
                    </HoverCardTrigger>
                  )}
                </div>
                <HoverCardContent className="w-full">
                  <div className="flex flex-col gap-2 text-sm">
                    <span>Commision, per share: 0.5% + 0.012$ = </span>
                    <span>+ Per order: {COMMISSION_PERCENT}$</span>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <Button disabled={isSubmitting || !form.watch('amount')} type="submit">
                {isSubmitting ? 'Processing...' : 'Buy'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCoinDialog;
