import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const BorrowRequestList = ({ requests, efficiencyRate, onViewAll, onItemClick }) => {
 return (
 <div className="dashboard-card p-8 flex flex-col h-full rounded-4xl transition-all duration-300">
 <div className="flex items-center justify-between mb-8">
 <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Borrow Requests</h4>
 <button
 onClick={onViewAll}
 className="text-xs font-bold text-[#1A2B56] dark:text-blue-400 hover:underline transition-opacity hover:opacity-70"
 >
 View All
 </button>
 </div>
 <div className="flex-1 space-y-5">
 {requests.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-48 text-slate-400">
 <p className="text-sm font-medium">No pending requests</p>
 </div>
) : requests.map((request) => (
 <div key={request._id} onClick={() => onItemClick?.(request)} className="flex items-start gap-4 p-3 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-2xl transition-all cursor-pointer">
 {request.user_id?.avatar ? (
 <img alt="Avatar" className="w-10 h-10 rounded-full border border-white dark:border-slate-600 object-cover" src={request.user_id.avatar} />
 ) : (
 <div className="w-10 h-10 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold shrink-0">
 {request.user_id?.name?.charAt(0) || 'U'}
 </div>
 )}

 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold text-[#1A2B56] dark:text-blue-300 truncate">
 {request.user_id?.name} <span className="text-slate-500 dark:text-slate-400 font-medium">requested</span>
 </p>
 <p className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{request.equipment_id?.name}</p>
 <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
 {formatDistanceToNow(new Date(request.createdAt))} ago • {request.user_id?.department || 'General'}
 </p>
 </div>
 <span className="w-2 h-2 rounded-full mt-2 bg-amber-500"></span>
 </div>
 ))}
 </div>
 <div className="mt-8 pt-6 border-t border-white/40 dark:border-white/10">
 <div className="flex items-center justify-between text-xs">
 <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">Efficiency Rate</span>
 <span className="text-[#1A2B56] dark:text-white font-black text-sm">{efficiencyRate}%</span>
 </div>
 </div>
 </div>
 );
};

export default BorrowRequestList;
