import { Home, PieChart, Settings } from 'lucide-react';

export const TABLE_HEADERS = [
  { label: 'Rank', key: 'rank' },
  { label: 'Name', key: 'name' },
  { label: 'Symbol', key: 'symbol' },
  { label: 'Price (USD)', key: 'price' },
  { label: '24h Change', key: 'percent_change_24h' },
  { label: 'Market Cap', key: 'market_cap' }
] as const;

export const CRYPTO_LIMIT_PER_PAGE = 30;

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export const COMMISSION_PERCENT = 0.5;
export const COMMISSION_PER_COIN = 0.0012;
