import React from 'react';
const UserTable = ({ users, onOpenDetails, onEdit, onDelete, onToggleStatus }) => {

 const getStatusStyle = (status) => {
 switch (status) {
 case 'Active': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
 case 'Inactive': return 'bg-red-100 text-red-600 border border-red-200';
 case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
 default: return 'bg-slate-100 text-slate-600 border border-slate-200';
 }
 };

 const rowBg = "bg-white/70 group-hover:bg-white dark:bg-slate-800/60 dark:group-hover:bg-slate-700/80 backdrop-blur-sm transition-colors";

 return (
 <div>
 <table className="w-full text-left border-separate border-spacing-y-3 table-fixed">
 <colgroup>
 <col className="w-[32%]" />
 <col className="w-[22%]" />
 <col className="w-[20%]" />
 <col className="w-[14%]" />
 <col className="w-[12%]" />
 </colgroup>
 <thead>
 <tr className="text-slate-800 dark:text-slate-300">
 <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">AdminUser</th>
 <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">ID</th>
 <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Role</th>
 <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Status</th>
 <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80 text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {users.length > 0 ? (
 users.map(user => (
 <tr key={user._id} className="group cursor-pointer" onClick={() => onOpenDetails && onOpenDetails(user)}>
 {/* AdminUser: avatar + name + email */}
 <td className={`p-3 rounded-l-xl ${rowBg}`}>
 <div className="flex items-center gap-3 max-w-[280px]">
 {user.avatarUrl ? (
 <img alt={user.displayName} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-slate-600 shadow-sm" src={user.avatarUrl} />
 ) : (
 <div className="w-9 h-9 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 border-white dark:border-slate-600">
 {user.displayName?.charAt(0) || user.username?.charAt(0)}
 </div>
 )}
 <div className="min-w-0 flex-1">
 <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.displayName}</p>
 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate break-all">{user.email}</p>
 </div>
 </div>
 </td>

 {/* ID */}
 <td className={`p-3 ${rowBg}`}>
 <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide">{user._id}</span>
 </td>

 {/* Role: plain text */}
 <td className={`p-3 text-sm font-medium text-slate-500 dark:text-slate-400 ${rowBg}`}>
 {user.role}
 </td>

 {/* Status: pill badge */}
 <td className={`p-3 ${rowBg}`}>
 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${getStatusStyle(user.isActive !== false ? 'Active' : 'Inactive')}`}>
 {user.isActive !== false ? 'Active' : 'Inactive'}
 </span>
 </td>

 {/* Actions */}
 <td className={`p-3 rounded-r-xl text-right ${rowBg}`} onClick={e => e.stopPropagation()}>
 <div className="flex items-center justify-end gap-1.5 text-slate-400 transition-opacity">
 <button
 onClick={() => onEdit && onEdit(user)}
 className="p-1.5 hover:bg-white/80 dark:hover:bg-slate-600 rounded-lg transition-all text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400 inline-flex items-center justify-center"
 >
 <span className="material-symbols-outlined text-[10px]">tune</span>
 </button>
 <button
 onClick={() => onToggleStatus && onToggleStatus(user)}
 className={`p-1.5 rounded-lg transition-all inline-flex items-center justify-center ${user.isActive !== false ? 'hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-500'}`}
 >
 <span className="material-symbols-outlined text-[10px]">{user.isActive !== false ? 'person_off' : 'check_circle'}</span>
 </button>
 <button
 onClick={() => onDelete && onDelete(user)}
 className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all text-slate-400 hover:text-red-500 inline-flex items-center justify-center"
 >
 <span className="material-symbols-outlined text-[10px]">delete</span>
 </button>
 </div>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={5} className="py-12 text-center bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
 <div className="flex flex-col items-center gap-3">
 <span className="material-symbols-outlined text-4xl text-slate-300">person_search</span>
 <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">No users found</p>
 <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
 </div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 );
};

export default UserTable;
