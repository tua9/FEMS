import { useEffect, useMemo, useState } from 'react';
import { technicianApi } from '@/services/api/technicianApi';

export type TechnicianReport = any;

export const useReports = () => {
  const [reports, setReports] = useState<TechnicianReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await technicianApi.getAllReports();
        if (!mounted) return;
        setReports(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to fetch reports');
        setReports([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => ({ reports, loading, error }), [reports, loading, error]);
};
