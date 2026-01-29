import React from 'react';

const DescriptionField: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                Issue Description
            </h3>
            <textarea
                className="w-full input-glass rounded-3xl p-6 focus:ring-2 focus:ring-navy-deep outline-none text-sm text-slate-700 dark:text-slate-300 min-h-[220px]"
                placeholder="Describe the issue (e.g., 'Slippery floor near stairs', 'Leaking faucet', 'Broken chair')..."
            />
        </div>
    );
};

export default DescriptionField;