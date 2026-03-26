import { useState, useEffect, useMemo, useCallback } from 'react';
import { scheduleService } from '@/services/scheduleService';

/**
 * Hook để lấy slot học hiện tại của student (hôm nay).
 * Trả về slot đang diễn ra theo thời gian thực.
 */
export const useCurrentSession = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await scheduleService.getMySchedules(today);
      setSchedules(Array.isArray(res) ? res : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Slot đang diễn ra ngay lúc này (startAt <= now <= endAt)
  const activeSchedule = useMemo(() => {
    if (!schedules.length) return null;
    const now = new Date();
    return schedules.find(
      (s) => new Date(s.startAt) <= now && new Date(s.endAt) >= now
    ) || null;
  }, [schedules]);

  const isSessionOngoing = !!activeSchedule;

  return { activeSchedule, isSessionOngoing, loading, refresh: load };
};
