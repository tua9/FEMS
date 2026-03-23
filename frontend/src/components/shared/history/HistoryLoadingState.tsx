import React from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface HistoryLoadingStateProps {
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const HistoryLoadingState: React.FC<HistoryLoadingStateProps> = ({ loading, error, onRetry }) => {
    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined animate-spin text-4xl text-[#1E2B58]/20">progress_activity</span>
                <p className="text-sm font-bold text-[#1E2B58]/40 uppercase tracking-widest">Syncing History Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Failed to load data</p>
                <p className="text-xs text-red-400/80">{error}</p>
                <button
                    onClick={onRetry}
                    className="mt-2 px-6 py-2 rounded-full bg-[#1E2B58] text-white text-xs font-bold hover:scale-105 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return null;
};
