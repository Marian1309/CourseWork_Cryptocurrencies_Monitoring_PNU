'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { toast } from '@/hooks/use-toast';

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

const formSchema = z.object({
  coinName: z.string().min(1, 'Coin name is required'),
  amount: z
    .string()
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: 'Amount must be a positive number'
    })
});

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
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coinName,
      amount: ''
    }
  });

  const handleBuyCoin = async () => {
    await buyCoin({
      name: coinName,
      amount: Number(form.getValues('amount')),
      symbol: coinSymbol,
      price: coinPrice,
      id: coinId
    });

    form.reset();

    setOpen(false);

    toast({
      title: 'Coin purchased',
      description: `You've bought ${form.getValues('amount')} ${coinName}.`
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
              <Button type="submit">Buy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BuyCoinDialog;
