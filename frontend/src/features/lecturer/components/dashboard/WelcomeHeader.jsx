import React from 'react';

export const WelcomeHeader = ({ name }) => {
 return (
 <header className="mb-8 md:mb-12">
 <div className="flex flex-col gap-1 sm:gap-2">
 <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight break-words">
 Welcome, {name}
 </h2>
 <p className="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg">
 Here's your academic facility overview for today.
 </p>
 </div>
 </header>
 );
};
