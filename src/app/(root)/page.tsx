'use client';

import type { NextPage } from 'next';

import CryptoTable from './_components/crypto-table';

// const data = [
//   { name: 'Jan', btc: 4000, eth: 2400, bnb: 2400 },
//   { name: 'Feb', btc: 3000, eth: 1398, bnb: 2210 },
//   { name: 'Mar', btc: 2000, eth: 9800, bnb: 2290 },
//   { name: 'Apr', btc: 2780, eth: 3908, bnb: 2000 },
//   { name: 'May', btc: 1890, eth: 4800, bnb: 2181 },
//   { name: 'Jun', btc: 2390, eth: 3800, bnb: 2500 },
//   { name: 'Jul', btc: 3490, eth: 4300, bnb: 2100 }
// ];

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 bg-white p-4 dark:bg-gray-800">
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Welcome to Crypto Monitor. This dashboard provides real-time information
              about various cryptocurrencies. Click on a row to see more details about a
              specific cryptocurrency.
            </p>

            {/* <Card>
              <CardHeader>
                <CardTitle>Price Trends</CardTitle>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="btc" name="Bitcoin" stroke="#FF9900" type="monotone" />
                    <Line
                      dataKey="eth"
                      name="Ethereum"
                      stroke="#3C3C3D"
                      type="monotone"
                    />
                    <Line dataKey="bnb" name="Cardano" stroke="#0033AD" type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}

            <CryptoTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
