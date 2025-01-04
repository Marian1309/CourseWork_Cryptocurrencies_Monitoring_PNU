'use client';

import { useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import getUserBalance from '@/actions/get-balance';

import PortfolioTable from './_components/table';

const PortfolioPage = () => {
  const { data: balance } = useQuery({
    queryFn: () => getUserBalance(),
    queryKey: ['balance']
  });

  return (
    <div className="mx-auto px-8 py-8">
      <Card>
        <div className="flex items-start justify-between gap-x-2">
          <CardHeader className="flex-1">
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>Your current cryptocurrency holdings</CardDescription>
          </CardHeader>

          {balance && <p className="p-6 font-bold">Balance: {balance.toFixed(2)} $</p>}
        </div>

        <CardContent>
          <PortfolioTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioPage;
