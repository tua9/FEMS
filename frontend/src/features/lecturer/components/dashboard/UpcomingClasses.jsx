import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const classes = [
 { time: '09:00 AM - 11:30 AM', title: 'Advanced Web Design', room: 'Room AL-201', opacity: '' },
 { time: '01:30 PM - 03:00 PM', title: 'UI/UX Fundamentals', room: 'Lab 105 (Design Studio)', opacity: '' },
 { time: '04:00 PM - 05:30 PM', title: 'Department Meeting', room: 'Main Hall A', opacity: 'opacity-60' },
];

export const UpcomingClasses = () => {
 return (
 <div className="dashboard-card rounded-3xl lg:rounded-4xl p-6 lg:p-8 h-full flex flex-col">
 <div className="flex items-center justify-between mb-6 lg:mb-8">
 <h3 className="text-lg lg:text-xl font-extrabold text-[#1E2B58] dark:text-white">Upcoming Classes</h3>
 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></span>
 </div>
 <div className="space-y-4 flex-1">
 {classes.map((cls, idx) => (
 <div key={idx} className={`p-4 rounded-2xl dashboard-card hover:border-[#1E2B58]/20 transition-all cursor-pointer group ${cls.opacity}`}>
 <p className="text-[0.5625rem] lg:text-[0.625rem] font-black text-[#1E2B58]/40 dark:text-white/40 uppercase tracking-widest mb-1.5 lg:mb-2">
 {cls.time}
 </p>
 <h4 className="text-sm lg:text-base font-bold text-[#1E2B58] dark:text-white group-hover:text-[#4f75ff] transition-colors line-clamp-1">
 {cls.title}
 </h4>
 <div className="flex items-center gap-1.5 lg:gap-2 mt-2 lg:mt-3">
 <MapPin className="w-3.5 h-3.5 opacity-60 text-slate-500 dark:text-slate-400 shrink-0" />
 <span className="text-[0.625rem] lg:text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">{cls.room}</span>
 </div>
 </div>
 ))}
 </div>
 <Button className="w-full mt-4 lg:mt-6 py-3 lg:py-4 h-auto rounded-xl lg:rounded-2xl bg-[#1E2B58] text-white text-[0.6875rem] lg:text-xs font-bold uppercase tracking-widest hover:bg-[#1E2B58]/90 transition-all shadow-lg shadow-[#1E2B58]/20 shrink-0">
 Open Full Calendar
 </Button>
 </div>
 );
};
