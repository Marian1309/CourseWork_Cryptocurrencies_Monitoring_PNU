export type CryptoData = {
  id: number;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  percent_change_24h: number;
  market_cap: number;
};

export type CryptoState = {
  data: CryptoData[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
};

export type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};
