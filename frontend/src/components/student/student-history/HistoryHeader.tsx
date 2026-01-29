import React from 'react';

const HistoryHeader: React.FC = () => {
    return (
        <div className="mb-12 text-left">
            <h1 className="text-4xl font-extrabold text-[var(--navy-deep)] dark:text-white mb-2">
                My History
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-medium">
                Keep track of your past equipment borrowings and service resolutions.
            </p>
        </div>
    );
};

export default HistoryHeader;