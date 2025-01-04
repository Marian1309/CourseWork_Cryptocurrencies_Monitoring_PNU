'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Properties = {
  data: {
    name: string;
    btc: number;
    eth: number;
    bnb: number;
    sol: number;
    doge: number;
    tron: number;
  }[];
};

const Trends = ({ data }: Properties) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends 2024</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <LineChart data={data.map((item) => ({ ...item, btc: item.btc / 10 }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="btc" name="Bitcoin (*10)" stroke="#FF9900" type="monotone" />
            <Line dataKey="eth" name="Ethereum" stroke="#3C3C3D" type="monotone" />
            <Line dataKey="bnb" name="BNB" stroke="#0033AD" type="monotone" />
            <Line dataKey="sol" name="Solana" stroke="#00B2A9" type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Trends;
