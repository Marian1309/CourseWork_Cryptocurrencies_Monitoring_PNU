import type { NextPage } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import PortfolioTable from './_components/table';

export const runtime = 'edge';

const PortfolioPage: NextPage = () => {
  return (
    <div className="mx-auto px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
          <CardDescription>Your current cryptocurrency holdings</CardDescription>
        </CardHeader>

        <CardContent>
          <PortfolioTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioPage;
