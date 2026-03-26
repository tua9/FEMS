import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Clock, ChevronRight } from 'lucide-react';
import { AnimatedSection } from '@/components/motion';

/**
 * Card hiển thị slot học đang diễn ra của student.
 * Nếu không có slot → không render.
 */
const CurrentSessionCard = ({ schedule, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <AnimatedSection variant="fade" delay={0.05} className="mb-8">
        <div className="glass-card animate-pulse rounded-4xl p-8">
          <div className="h-5 w-48 rounded-full bg-[#1E2B58]/10 dark:bg-white/10" />
          <div className="mt-4 h-4 w-72 rounded-full bg-[#1E2B58]/5 dark:bg-white/5" />
        </div>
      </AnimatedSection>
    );
  }

  if (!schedule) return null;

  const fmtTime = (d) =>
    new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const courseName = schedule.classId?.name || schedule.title || '—';
  const classCode  = schedule.classId?.code || '—';
  const slotLabel  = schedule.slotId?.name || schedule.slotId?.code || '—';
  const timeRange  = `${fmtTime(schedule.startAt)} – ${fmtTime(schedule.endAt)}`;
  const roomName   = schedule.roomId?.name || '—';

  return (
    <AnimatedSection variant="curtain" delay={0.05} className="mb-8">
      <div className="dashboard-card rounded-4xl p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
            Current Learning Session
          </h3>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-emerald" />
            In Progress
          </span>
        </div>

        {/* Session Info Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
              Course
            </p>
            <p className="mt-1 font-bold text-[#1E2B58] dark:text-white">{courseName}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
              Class
            </p>
            <p className="mt-1 font-bold text-[#1E2B58] dark:text-white">{classCode}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
              Slot
            </p>
            <p className="mt-1 font-bold text-[#1E2B58] dark:text-white">
              {slotLabel} · {timeRange}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
              Room
            </p>
            <p className="mt-1 font-bold text-[#1E2B58] dark:text-white">{roomName}</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/student/equipment')}
          className="btn-navy group flex items-center gap-3 rounded-full px-6 py-3 font-bold shadow-lg shadow-[#1E2B58]/20 hover:scale-105 active:scale-95"
        >
          Borrow Equipment
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </AnimatedSection>
  );
};

export default CurrentSessionCard;
