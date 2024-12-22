import axios from 'axios';

const coinMarketCapApi = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency'
});

export default coinMarketCapApi;
