import React from 'react';
import { Button } from '@/components/ui/button';

export const RecentActivities = () => {
 return (
 <div className="dashboard-card rounded-3xl lg:rounded-4xl p-6 lg:p-8 h-full flex flex-col">
 <div className="flex items-center justify-between mb-6 lg:mb-8">
 <h3 className="text-lg lg:text-xl font-extrabold text-[#1E2B58] dark:text-white">Recent Activities</h3>
 <Button variant="link" className="text-[0.6875rem] lg:text-xs font-bold text-[#4f75ff] uppercase tracking-[0.15em] lg:tracking-widest hover:underline p-0 h-auto">
 View All
 </Button>
 </div>
 <div className="space-y-6 lg:space-y-8 relative before:absolute before:left-[0.625rem] lg:before:left-[0.6875rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1E2B58]/5 dark:before:bg-white/5 flex-1">

 {/* Activity 1 */}
 <div className="relative pl-8 lg:pl-10">
 <div className="absolute left-0 top-1.5 w-[1.25rem] lg:w-[1.375rem] h-[1.25rem] lg:h-[1.375rem] bg-white dark:bg-slate-800 rounded-full border-4 border-[#1E2B58] dark:border-white shadow-sm z-10 shrink-0"></div>
 <div className="flex flex-col gap-1">
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white">Room AL-402 Access Approved</p>
 <p className="text-xs text-slate-500">Johnathan Chen • 12 mins ago</p>
 <div className="mt-2 text-xs bg-[#1E2B58]/5 dark:bg-white/5 p-3 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 break-words">
 Approved request for advanced robotics workshop sessions.
 </div>
 </div>
 </div>

 {/* Activity 2 */}
 <div className="relative pl-8 lg:pl-10">
 <div className="absolute left-0 top-1.5 w-[1.25rem] lg:w-[1.375rem] h-[1.25rem] lg:h-[1.375rem] bg-white dark:bg-slate-800 rounded-full border-4 border-slate-300 dark:border-slate-600 shadow-sm z-10 shrink-0"></div>
 <div className="flex flex-col gap-1">
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white">Equipment Returned</p>
 <p className="text-xs text-slate-500">Sarah Nguyen • 2 hours ago</p>
 <p className="text-xs italic text-slate-400 mt-1">"Asset: MacBook Pro M2 (FPT-LAP-082) returned in perfect condition."</p>
 </div>
 </div>

 {/* Activity 3 */}
 <div className="relative pl-8 lg:pl-10">
 <div className="absolute left-0 top-1.5 w-[1.25rem] lg:w-[1.375rem] h-[1.25rem] lg:h-[1.375rem] bg-white dark:bg-slate-800 rounded-full border-4 border-slate-300 dark:border-slate-600 shadow-sm z-10 shrink-0"></div>
 <div className="flex flex-col gap-1">
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white">Report Logged</p>
 <p className="text-xs text-slate-500">System • 4 hours ago</p>
 <p className="text-xs text-slate-500 mt-1">Maintenance report generated for Lab 304 projector.</p>
 </div>
 </div>

 </div>
 </div>
 );
};
