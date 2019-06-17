export enum CryptoCoin {
  BTC = 'BTC',
  ETH = 'ETH', // ERC-20 tokens
  LTC = 'LTC',
  ZCN = 'ZCN',
  BAT = 'BAT', // ERC-20 tokens
  OMG = 'OMG', // ERC-20 tokens
  REP = 'REP', // ERC-20 tokens
  XRP = 'XRP',
  BCH = 'BCH',
  XLM = 'XLM',
  DASH = 'DASH',
  ZEC = 'ZEC',
  BSV = 'BSV',
  BTG = 'BTG',
}

export enum FiatCoin {
  EUR = 'EUR',
  USD = 'USD',
}

export type CoinType = CryptoCoin | FiatCoin;

export const allCryptoCoins: CryptoCoin[] = [
  CryptoCoin.BTC,
  CryptoCoin.ETH,
  CryptoCoin.LTC,
  CryptoCoin.ZCN,
  CryptoCoin.BAT,
  CryptoCoin.OMG,
  CryptoCoin.REP,
  CryptoCoin.XRP,
  CryptoCoin.BCH,
  CryptoCoin.XLM,
  CryptoCoin.DASH,
  CryptoCoin.ZEC,
  CryptoCoin.BSV,
  CryptoCoin.BTG,
];

export const allFiatCoins: FiatCoin[] = [
  FiatCoin.EUR,
  FiatCoin.USD,
];

export const allCoins: CoinType[] = [
  ...allCryptoCoins,
  ...allFiatCoins,
];