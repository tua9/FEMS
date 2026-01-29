
import React from 'react';
import { ACTIVITIES, UPCOMING_CLASSES } from './constants';

const LecturerDashboard: React.FC = () => {
  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-12">
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight">
          Welcome, Dr. Alex Rivers
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">
          Here's your academic facility overview for today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Equipment Borrowed', value: '24', icon: 'laptop_mac' },
          { label: 'Pending Requests', value: '08', icon: 'pending_actions' },
          { label: 'Reports Sent', value: '15', icon: 'assignment_turned_in' },
          { label: 'Assigned Rooms', value: '04', icon: 'meeting_room' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 rounded-[32px] flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#1E2B58]/10 dark:bg-accent-blue/20 text-[#1E2B58] dark:text-accent-blue flex-shrink-0">
              <span className="material-symbols-outlined text-4xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-[#1E2B58] dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[32px] p-8 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Recent Activities</h3>
              <button className="text-xs font-bold text-accent-blue uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1E2B58]/5 dark:before:bg-white/5">
              {ACTIVITIES.map((activity) => (
                <div key={activity.id} className="relative pl-10">
                  <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] bg-white dark:bg-slate-800 rounded-full border-4 ${activity.type === 'access' ? 'border-[#1E2B58]' : 'border-slate-300'} shadow-sm z-10`}></div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.subject} • {activity.time}</p>
                    {activity.description && (
                      <div className="mt-2 text-xs bg-[#1E2B58]/5 dark:bg-white/5 p-3 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 italic">
                        {activity.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card rounded-[32px] p-8 h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Upcoming Classes</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-4">
              {UPCOMING_CLASSES.map((session) => (
                <div key={session.id} className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:border-[#1E2B58]/20 transition-all cursor-pointer group">
                  <p className="text-[10px] font-black text-[#1E2B58]/40 dark:text-white/40 uppercase tracking-widest mb-2">{session.timeRange}</p>
                  <h4 className="font-bold text-[#1E2B58] dark:text-white group-hover:text-accent-blue transition-colors">{session.title}</h4>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="material-symbols-rounded text-sm opacity-60">location_on</span>
                    <span className="text-[11px] font-bold text-slate-500">{session.location}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="navy-gradient-btn w-full mt-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest">
              Open Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
