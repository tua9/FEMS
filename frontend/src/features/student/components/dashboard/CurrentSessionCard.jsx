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

  const isCheckedIn = schedule.status === 'ongoing';

  return (
    <AnimatedSection variant="curtain" delay={0.05} className="mb-8">
      <div className="dashboard-card rounded-4xl p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
            Current Learning Session
          </h3>
          <span className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
            isCheckedIn
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isCheckedIn ? 'bg-emerald-500 glow-emerald animate-pulse' : 'bg-amber-500'}`} />
            {isCheckedIn ? 'Session is active' : 'Session not started'}
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
        <div className={`mt-6 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
          isCheckedIn 
            ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20' 
            : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
        }`}>
          <div>
            <p className={`font-bold ${isCheckedIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {isCheckedIn ? 'Equipment are available.' : 'Equipment are locked.'}
            </p>
            <p className={`text-xs mt-0.5 ${isCheckedIn ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-slate-400 dark:text-slate-500'}`}>
              {isCheckedIn ? 'You can now borrow equipment for this session' : 'Wait for your lecturer to start the session to borrow equipment'}
            </p>
          </div>
          {isCheckedIn && (
            <button
              onClick={() => navigate('/student/equipment')}
              className="btn-navy group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"
            >
              Borrow Equipment
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CurrentSessionCard;
