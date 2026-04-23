  import axios from 'axios';

  export interface YahooQuote {
    symbol: string;
    resolvedSymbol: string;
    name: string;
    exchange?: string | null;
    currency?: string | null;
    price: number;
    change: number;
    changePercent: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    previousClose: number;
    marketCap?: number | null;
    trailingPE?: number | null;
    dividendYield?: number | null;
    sector?: string | null;
    industry?: string | null;
  }

  export interface YahooHistoryPoint {
    timestamp: string | null;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export interface YahooHistoryResponse {
    symbol: string;
    resolvedSymbol: string;
    period: string;
    interval: string;
    items: YahooHistoryPoint[];
  }

  export interface YahooInfoResponse {
    symbol: string;
    resolvedSymbol: string;
    longName?: string | null;
    shortName?: string | null;
    exchange?: string | null;
    quoteType?: string | null;
    currency?: string | null;
    sector?: string | null;
    industry?: string | null;
    website?: string | null;
    longBusinessSummary?: string | null;
    marketCap?: number | null;
    fullTimeEmployees?: number | null;
    country?: string | null;
    city?: string | null;
    state?: string | null;
    trailingPE?: number | null;
    trailingEps?: number | null;
    forwardPE?: number | null;
    dividendYield?: number | null;
    fiftyTwoWeekHigh?: number | null;
    fiftyTwoWeekLow?: number | null;
  }

  export interface YahooSearchResult {
    symbol?: string;
    name?: string;
    exchange?: string;
    type?: string;
  }

  export interface YahooSearchResponse {
    query: string;
    results: YahooSearchResult[];
  }

  export const yahooFinanceApi = {
    getQuote: async (symbol: string) => {
      const { data } = await axios.get<YahooQuote>(`/api/yahoo/quote/${encodeURIComponent(symbol)}`);
      return data;
    },

    getHistory: async (symbol: string, period = '1mo', interval = '1d') => {
      const { data } = await axios.get<YahooHistoryResponse>(`/api/yahoo/history/${encodeURIComponent(symbol)}`, {
        params: { period, interval },
      });
      return data;
    },

    getInfo: async (symbol: string) => {
      const { data } = await axios.get<YahooInfoResponse>(`/api/yahoo/info/${encodeURIComponent(symbol)}`);
      return data;
    },

    search: async (query: string, limit = 10) => {
      const { data } = await axios.get<YahooSearchResponse>('/api/yahoo/search', {
        params: { q: query, limit },
      });
      return data;
    },
  };
