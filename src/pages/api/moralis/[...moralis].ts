import { MoralisNextApi } from '@moralisweb3/next';

export default MoralisNextApi({
  apiKey: process.env.MORALIS_API_KEY ?? '',
  authentication: {
    domain: 'nbc-licensing-app.vercel.app',
    uri: 'http://localhost:3000',
    timeout: 120,
  },
});