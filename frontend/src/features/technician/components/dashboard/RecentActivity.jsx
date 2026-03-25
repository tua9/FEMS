import React from 'react';

const RecentActivity = () => {
 // Mock data - replace with real API call
 const activities= [
 { id: '1', type: 'completed', title: 'Fixed broken light in Room 301', timestamp: '2 hours ago' },
 { id: '2', type: 'started', title: 'Repair leaking pipe', timestamp: '4 hours ago' },
 { id: '3', type: 'updated', title: 'Updated status for AC maintenance', timestamp: '1 day ago' },
 ];

 const getActivityIcon = (type) => {
 const icons = {
 completed: { icon: 'check_circle', color: 'text-green-500' },
 started: { icon: 'play_circle', color: 'text-blue-500' },
 updated: { icon: 'update', color: 'text-purple-500' },
 };
 return icons[type];
 };

 return (
 <div className="glass-main rounded-4xl p-6 shadow-2xl">
 <h2 className="text-xl font-extrabold text-navy-deep dark:text-white mb-6 flex items-center gap-2">
 <span className="material-symbols-outlined">history</span>
 Recent Activity
 </h2>

 <div className="space-y-4">
 {activities.map((activity) => {
 const { icon, color } = getActivityIcon(activity.type);
 return (
 <div key={activity.id} className="flex items-start gap-3">
 <div className={`w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 flex items-center justify-center flex-shrink-0`}>
 <span className={`material-symbols-outlined text-lg ${color}`}>
 {icon}
 </span>
 </div>
 <div className="flex-1">
 <p className="text-sm font-semibold text-navy-deep dark:text-white">
 {activity.title}
 </p>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
 {activity.timestamp}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
};

export default RecentActivity;
