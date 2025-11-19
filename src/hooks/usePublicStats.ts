
import { useState, useEffect, useCallback } from 'react';

interface PublicStats {
  totalStock: number;
  totalSold: number;
}

export const usePublicStats = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch public stats. Status: ${response.status}`);
      }
      const data: PublicStats = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicStats();
  }, [fetchPublicStats]);

  return { stats, loading, error, refetch: fetchPublicStats };
};
