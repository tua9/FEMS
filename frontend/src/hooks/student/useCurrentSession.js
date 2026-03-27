import { useState, useEffect, useMemo, useCallback } from 'react';
import { scheduleService } from '@/services/scheduleService';
import { getTodayVN, getSlotTimeStatus } from '@/utils/dateUtils';

/**
 * Hook để lấy slot học hiện tại của student (hôm nay).
 * Trả về slot đang diễn ra theo thời gian thực, cập nhật mỗi phút.
 */
export const useCurrentSession = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nowTick, setNowTick] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const today = getTodayVN();
      const res = await scheduleService.getMySchedules(today);
      setSchedules(Array.isArray(res) ? res : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Tự động re-render mỗi 30s để cập nhật trạng thái thời gian thực
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const activeSchedule = useMemo(() => {
    if (!schedules.length) return null;
    
    // Tìm slot "ongoing" theo giờ VN
    return schedules.find(s => getSlotTimeStatus(s.startAt, s.endAt) === 'ongoing') || null;
  }, [schedules, nowTick]); // Phụ thuộc vào nowTick để cập nhật đúng lúc

  const isSessionOngoing = !!activeSchedule;

  return { activeSchedule, isSessionOngoing, loading, refresh: load };
};
