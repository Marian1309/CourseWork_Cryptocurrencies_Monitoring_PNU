'use server';

const getTrendCoins = async () => {
  const trends: {
    name: string;
    btc: number;
    eth: number;
    bnb: number;
    sol: number;
    doge: number;
    tron: number;
  }[] = [
    {
      name: 'Jan',
      btc: 42_280,
      eth: 2283,
      bnb: 300.5,
      sol: 4257.65,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Feb',
      btc: 43_077,
      eth: 399,
      bnb: 399.1,
      sol: 4069.42,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Mar',
      btc: 61_168,
      eth: 3647,
      bnb: 606.89,
      sol: 5269.45,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Apr',
      btc: 71_333,
      eth: 3014,
      bnb: 578.41,
      sol: 8508.96,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'May',
      btc: 60_609,
      eth: 3762,
      bnb: 593.8,
      sol: 5325.06,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Jun',
      btc: 67_475,
      eth: 3437,
      bnb: 582.3,
      sol: 6947.18,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Jul',
      btc: 62_673,
      eth: 3231,
      bnb: 576.4,
      sol: 6143.72,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Aug',
      btc: 64_625,
      eth: 2513,
      bnb: 532.9,
      sol: 7206.71,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Sep',
      btc: 58_969,
      eth: 2603,
      bnb: 567.51,
      sol: 5677.87,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Oct',
      btc: 63_335,
      eth: 2519,
      bnb: 576.6,
      sol: 6401.12,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Nov',
      btc: 70_216,
      eth: 3702,
      bnb: 653.72,
      sol: 7064.3,
      doge: 2800,
      tron: 2000
    },
    {
      name: 'Dec',
      btc: 96_461,
      eth: 3362,
      bnb: 699.93,
      sol: 9971.45,
      doge: 2800,
      tron: 2000
    }
  ];

  return trends;
};

export default getTrendCoins;
