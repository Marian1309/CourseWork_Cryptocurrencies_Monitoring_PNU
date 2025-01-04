'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { BadgeInfo } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { COMMISSION_PERCENT, COMMISSION_PER_COIN } from '@/constants';

import type { buyCoinSchema } from '@/schemas/but-coin';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
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

import type { Coin } from '@/actions/buy-coin';
import sellCoin from '@/actions/sell-coin';

type SellDialogProperties = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  coin: Coin;
};

const SellDialog = ({ coin, isOpen, setIsOpen }: SellDialogProperties) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        amount: z.string().refine((value) => Number(value) <= coin.amount, {
          message: 'You do not have enough coins.'
        }),
        coinName: z.string()
      })
    ),
    defaultValues: {
      coinName: coin.name,
      amount: ''
    },
    mode: 'onChange'
  });

  const router = useRouter();

  useEffect(() => {
    const subscription = form.watch((value) => {
      const amount = Number.parseFloat(value.amount as string) || 0;
      const commission = amount * COMMISSION_PER_COIN + amount * coin.price * 0.05;
      const percent = amount == 0 ? 0 : COMMISSION_PERCENT;
      setTotalProfit(amount * coin.price + commission + percent);
    });

    return () => subscription.unsubscribe();
  }, [coin.price, form]);

  const handleBuyMoreCoin = async (data: z.infer<typeof buyCoinSchema>) => {
    setIsSubmitting(true);
    await sellCoin({
      coinId: +coin.id,
      amount: +data.amount,
      soldPrice: coin.price
    });
    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog onOpenChange={() => setIsOpen((previous) => !previous)} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            You can sell {coin.amount} {coin.name} by {coin.price.toFixed(4)} $ right now.
          </DialogTitle>

          <DialogDescription>
            Enter the amount of {coin.name} you want to sell.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleBuyMoreCoin)}>
            <FormField
              control={form.control}
              name="coinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coin Name</FormLabel>
                  <FormControl>
                    <Input disabled placeholder={coin.name} {...field} />
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
                  <div className="flex flex-col items-start">
                    <span>
                      Profit: ${(coin.price * Number(form.watch('amount'))).toFixed(4)}
                    </span>
                    <span>
                      Taxes: $
                      {(totalProfit - coin.price * Number(form.watch('amount'))).toFixed(
                        4
                      )}
                    </span>
                    <span>Total Cost: ${totalProfit.toFixed(4)}</span>
                  </div>

                  {form.watch('amount') && (
                    <HoverCardTrigger className="flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4" />
                    </HoverCardTrigger>
                  )}
                </div>
                <HoverCardContent className="w-full">
                  <div className="flex flex-col gap-2 text-sm">
                    <span>Commision, per share: 0.5% + 0.012$ </span>
                    <span>+ Per order: {COMMISSION_PERCENT}$</span>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <Button
                disabled={
                  isSubmitting || !form.watch('amount') || !!form.formState.errors.amount
                }
                type="submit"
              >
                {isSubmitting ? 'Processing...' : 'Sell'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SellDialog;
