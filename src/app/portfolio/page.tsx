'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import PortfolioTable from './table';

const PortfolioPage = () => {
  return (
    <div className="mx-auto px-8 py-8">
      <div className="">
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
    </div>
  );
};

export default PortfolioPage;
