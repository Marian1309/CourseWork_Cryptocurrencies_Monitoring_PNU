import { z } from 'zod';

export const buyCoinSchema = z.object({
  coinName: z.string().min(1, 'Coin name is required'),
  amount: z.string().refine((value) => Number(value) < 1_000_000, {
    message: 'Amount must be less than 1,000,000'
  })
});
export type BuyCoinSchema = z.infer<typeof buyCoinSchema>;
