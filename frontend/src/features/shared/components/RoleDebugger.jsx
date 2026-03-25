import React, { useEffect, useState } from 'react';

/**
 * Development only component to show current role and navigation state
 * Remove this in production
 */
const RoleDebugger = () => {
 const [role, setRole] = useState(null);

 useEffect(() => {
 const storedRole = localStorage.getItem('userRole');
 setRole(storedRole);

 // Listen for storage changes
 const handleStorage = () => {
 setRole(localStorage.getItem('userRole'));
 };

 window.addEventListener('storage', handleStorage);
 return () => window.removeEventListener('storage', handleStorage);
 }, []);

 if (process.env.NODE_ENV === 'production') return null;

 return (
 <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-xs font-mono">
 <div className="flex items-center gap-2">
 <span className="material-symbols-outlined text-sm">bug_report</span>
 <span>Role: <strong>{role || 'Not Set'}</strong></span>
 <button
 onClick={() => {
 localStorage.removeItem('userRole');
 setRole(null);
 window.location.href = '#/login';
 }}
 className="ml-2 px-2 py-1 bg-red-500 rounded text-[10px] hover:bg-red-600"
 >
 Clear
 </button>
 </div>
 </div>
 );
};

export default RoleDebugger;
