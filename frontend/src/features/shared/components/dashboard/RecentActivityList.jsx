import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { AnimatedSection } from "@/components/motion";
// ── Map activity type to badge label ──────────────────────────────────────
const ACTIVITY_BADGE= {
 access: {
 label: "Approval",
 color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
 },
 return: {
 label: "Equipment",
 color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
 },
 report: {
 label: "Report",
 color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
 },
};

export const RecentActivityList = ({
 activities,
 viewAllRoute,
 itemBaseRoute,
 className = "lg:col-span-2",
 title = "Recent Activities",
}) => {
 const navigate = useNavigate();

 return (
 <AnimatedSection variant="fade" delay={0.1} className={className}>
 <div className="dashboard-card h-full rounded-4xl p-8">
 <div className="mb-8 flex items-center justify-between">
 <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">{title}</h3>
 <button 
 onClick={() => navigate(viewAllRoute)} 
 className="flex items-center gap-1 text-xs font-bold tracking-widest text-[#4f75ff] uppercase hover:underline"
 >
 View All <span className="material-symbols-rounded text-sm">arrow_forward</span>
 </button>
 </div>
 
 <div className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2.75 before:w-0.5 before:bg-[#1E2B58]/5 dark:before:bg-white/5">
 {activities.length > 0 ? (
 activities.map((activity) => {
 const badge = ACTIVITY_BADGE[activity.type];
 const dest = itemBaseRoute ? `${itemBaseRoute}/${activity.id}` : viewAllRoute;
 const timeLabel = activity.time ? formatDistanceToNow(new Date(activity.time), { addSuffix: true }) : 'Just now';
 
 return (
 <div key={activity.id} onClick={() => navigate(dest)} className="group relative cursor-pointer pl-10">
 <div className={`absolute top-1.5 left-0 z-10 h-5.5 w-5.5 rounded-full border-4 bg-white shadow-sm transition-colors dark:bg-slate-800 ${activity.type === "access" ? "border-[#1E2B58] dark:border-white" : "border-slate-300 dark:border-slate-600"}`} />
 <div className="-m-3 flex flex-col gap-1 rounded-2xl p-3 transition-colors group-hover:bg-[#1E2B58]/4 dark:group-hover:bg-white/4">
 <div className="flex flex-wrap items-center gap-2">
 <p className="text-sm font-bold text-[#1E2B58] transition-colors group-hover:text-[#4f75ff] dark:text-white dark:group-hover:text-[#4f75ff]">{activity.title}</p>
 {badge && <span className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${badge.color}`}>{badge.label}</span>}
 </div>
 <p className="text-xs text-slate-500">{activity.subject} • {timeLabel}</p>
 {activity.description && (
 <p className={`mt-1 text-xs ${activity.type === 'report' ? 'text-slate-500' : 'text-slate-400 italic'}`}>
 {activity.description}
 </p>
 )}
 </div>
 </div>
 );
 })
 ) : (
 <div className="py-10 text-center">
 <p className="text-sm text-slate-400 italic">No recent activity found.</p>
 </div>
 )}
 </div>

 <div className="mt-8 flex items-center justify-center border-t border-[#1E2B58]/5 pt-6 dark:border-white/5">
 <button 
 onClick={() => navigate(viewAllRoute)} 
 className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-[#4f75ff] dark:text-slate-500 dark:hover:text-[#4f75ff]"
 >
 <span className="material-symbols-rounded text-sm">history</span> See full activity log
 </button>
 </div>
 </div>
 </AnimatedSection>
 );
};

export default RecentActivityList;
