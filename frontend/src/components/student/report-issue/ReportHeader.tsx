import React from 'react';

const ReportHeader: React.FC = () => {
    return (
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-navy-deep dark:text-white mb-4 tracking-tight">
                Issue Report
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Help us maintain our campus. Report any facility, equipment, or safety concerns across the campus.
            </p>
        </div>
    );
};

export default ReportHeader;