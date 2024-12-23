import { Home, Settings } from 'lucide-react';

export const TABLE_HEADERS = [
  { label: 'Rank', key: 'rank' },
  { label: 'Name', key: 'name' },
  { label: 'Symbol', key: 'symbol' },
  { label: 'Price (USD)', key: 'price' },
  { label: '24h Change', key: 'percent_change_24h' },
  { label: 'Market Cap', key: 'market_cap' }
] as const;

export const CRYPTO_LIMIT = 30;

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: Home },
  // { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  // { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Settings', href: '/settings', icon: Settings }
];
