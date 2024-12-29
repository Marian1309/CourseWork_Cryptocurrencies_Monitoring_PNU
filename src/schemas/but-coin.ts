import { z } from 'zod';

export const buyCoinSchema = z.object({
  coinName: z.string().min(1, 'Coin name is required'),
  amount: z
    .string()
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: 'Amount must be a positive number'
    })
});
export type BuyCoinSchema = z.infer<typeof buyCoinSchema>;
