import axios from 'axios';


export type YahooQuote = {
  symbol: string;
  resolvedSymbol?: string;
  name?: string;
  exchange?: string;
  currency?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  previousClose?: number;
  marketCap?: number;
  trailingPE?: number;
  dividendYield?: number;
  sector?: string;
  industry?: string;
};

export type YahooHistoryItem = {
  timestamp: string | null;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

export type YahooHistoryResponse = {
  symbol: string;
  resolvedSymbol?: string;
  period: string;
  interval: string;
  items: YahooHistoryItem[];
};

export type YahooInfoResponse = {
  symbol: string;
  resolvedSymbol?: string;
  longName?: string;
  shortName?: string;
  exchange?: string;
  quoteType?: string;
  currency?: string;
  sector?: string;
  industry?: string;
  website?: string;
  longBusinessSummary?: string;
  marketCap?: number;
  fullTimeEmployees?: number;
  country?: string;
  city?: string;
  state?: string;
  trailingPE?: number;
  trailingEps?: number;
  forwardPE?: number;
  dividendYield?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
};

export type YahooSearchResult = {
  symbol?: string;
  name?: string;
  exchange?: string;
  type?: string;
};

export type YahooSearchResponse = {
  query: string;
  results: YahooSearchResult[];
};

export const yahooFinanceApi = {
  async getQuote(symbol: string) {
    const { data } = await axios.get<YahooQuote>(`/api/yahoo/quote/${encodeURIComponent(symbol)}`);
    return data;
  },

  async getHistory(symbol: string, period = '1mo', interval = '1d') {
    const { data } = await axios.get<YahooHistoryResponse>(`/api/yahoo/history/${encodeURIComponent(symbol)}`, {
      params: { period, interval },
    });
    return data;
  },

  async getInfo(symbol: string) {
    const { data } = await axios.get<YahooInfoResponse>(`/api/yahoo/info/${encodeURIComponent(symbol)}`);
    return data;
  },

  async search(query: string, limit = 10) {
    const { data } = await axios.get<YahooSearchResponse>('/api/yahoo/search', {
      params: { q: query, limit },
    });
    return data;
  },
};
