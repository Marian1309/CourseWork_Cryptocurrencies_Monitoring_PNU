import axios from 'axios';

const CMC_API_KEY = process.env['X_CMC_PRO_API_KEY'];

const coinMarketCapApi = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com',

  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY || ''
  }
});

export default coinMarketCapApi;
