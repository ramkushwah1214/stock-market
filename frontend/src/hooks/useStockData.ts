import { useState, useEffect } from 'react';
import axios from 'axios';

const normalizeChartData = (payload: unknown) => {
  if (!Array.isArray(payload)) return [];

  return payload
    .map((item: any, index) => {
      const price = Number(item?.price ?? item?.close ?? item?.Close);
      if (!Number.isFinite(price)) return null;

      return {
        ...item,
        time: item?.time ?? item?.date ?? `Point ${index + 1}`,
        price,
      };
    })
    .filter(Boolean);
};

export function useStockData(symbol: string, timeRange: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!symbol) {
        setData([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Ensure symbol is formatted correctly for yahoo finance (e.g., RELIANCE.NS for Indian stocks)
        // If it doesn't have a suffix and isn't an index like ^NSEI, append .NS
        let formattedSymbol = symbol;
        if (!formattedSymbol.includes('.') && !formattedSymbol.startsWith('^')) {
          formattedSymbol = `${formattedSymbol}.NS`;
        }

        const response = await axios.get(`/api/stock/${formattedSymbol}?range=${timeRange}`);
        
        if (isMounted) {
          setData(normalizeChartData(response.data));
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching stock data:", err);
        if (isMounted) {
          setData([]);
          setError("Failed to load stock data");
          setLoading(false);
        }
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol, timeRange]);

  return { data, loading, error };
}
