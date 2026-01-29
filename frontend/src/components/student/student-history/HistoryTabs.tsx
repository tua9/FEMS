import React from 'react';

interface HistoryTabsProps {
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

const TABS = ['BORROWING HISTORY', 'CURRENTLY BORROWED', 'PENDING REQUESTS'];

const HistoryTabs: React.FC<HistoryTabsProps> = ({ selectedTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-8 mb-8 border-b border-slate-200 dark:border-slate-700 px-4">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`pb-4 text-sm font-bold tracking-wide transition-all ${selectedTab === tab
                            ? 'border-b-2 border-navy-deep text-navy-deep dark:text-blue-400'
                            : 'text-slate-500'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default HistoryTabs;