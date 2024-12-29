'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { Input } from '@/components/ui/input';

import buyCoin from '@/actions/buy-coin';

type BuyCoinDialogProperties = {
  coinName: string;
  coinPrice: number;
  coinSymbol: string;
  balance: number;
  coinId: string;
};

const BuyCoinDialog = ({
  coinName,
  coinPrice,
  coinSymbol,
  balance,
  coinId
}: BuyCoinDialogProperties) => {
  const [{ open, isSubmitting }, setBuyDialog] = useState({
    open: false,
    isSubmitting: false
  });

  const form = useForm<BuyCoinSchema>({
    resolver: zodResolver(buyCoinSchema),
    defaultValues: {
      coinName,
      amount: ''
    }
  });

  const handleBuyCoin = async (data: BuyCoinSchema) => {
    setBuyDialog((previous) => ({ ...previous, isSubmitting: true }));

    try {
      await buyCoin({
        name: coinName,
        amount: +data.amount,
        symbol: coinSymbol,
        price: coinPrice,
        id: coinId
      });

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
        <Button variant="outline">Buy Coin</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Cryptocurrency ({balance})</DialogTitle>

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
                    <Input placeholder="0.5" step="any" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isSubmitting} type="submit">
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
