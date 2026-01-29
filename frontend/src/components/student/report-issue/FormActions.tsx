import React from 'react';

const FormActions: React.FC = () => {
    return (
        <div className="flex items-center justify-between pt-6">
            <button
                type="button"
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Cancel Reporting
            </button>

            <button
                type="submit"
                className="btn-navy-gradient text-white py-4 px-10 rounded-full font-extrabold text-sm flex items-center justify-center gap-3"
            >
                Submit Report
                <span className="material-symbols-outlined text-lg">send</span>
            </button>
        </div>
    );
};

export default FormActions;