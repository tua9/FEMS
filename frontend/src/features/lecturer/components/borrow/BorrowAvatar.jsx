import React from 'react';

const BorrowAvatar = ({ name, avatarUrl, size = 'md' }) => {
  const initials = (name || 'U').slice(0, 2).toUpperCase();
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-[#1E2B58] dark:bg-slate-700 flex items-center justify-center text-white font-black shrink-0 overflow-hidden`}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        : <span>{initials}</span>
      }
    </div>
  );
};

export default BorrowAvatar;
