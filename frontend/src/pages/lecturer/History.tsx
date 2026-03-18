import React, { useState, useEffect } from 'react';
import { useBorrowRequestStore } from '../../stores/useBorrowRequestStore';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';

type Tab = 'report' | 'borrow' | 'approval';

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('borrow');
  const { borrowRequests, fetchMyBorrowRequests, loading } = useBorrowRequestStore();

  useEffect(() => {
    if (activeTab === 'borrow') {
      fetchMyBorrowRequests();
    }
  }, [activeTab, fetchMyBorrowRequests]);

  const renderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      handed_over: 'bg-blue-100 text-blue-700 border-blue-200',
      returned: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center justify-center w-24 h-7 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="pt-6 sm:pt-8 pb-10 px-6 max-w-350 mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="My History"
        subtitle="Track your recent activities and approvals across the portal"
      />

      <div className="flex justify-center mb-10">
        <div className="extreme-glass rounded-full p-1.5 inline-flex gap-1">
          {(['report', 'borrow', 'approval'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                ? 'bg-white dark:bg-white/15 text-[#1E2B58] dark:text-white shadow-md'
                : 'text-[#1E2B58]/40 dark:text-white/40'
                } px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all capitalize`}
            >
              {tab} History
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card !rounded-[24px] p-2 mb-8 flex flex-wrap gap-2 items-center">
        <div className="flex-grow-[2] min-w-[200px] relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[#1E2B58]/40">search</span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 pl-12 placeholder-[#1E2B58]/40"
            placeholder="Search by ID, class, or equipment..."
            type="text"
          />
        </div>
        <div className="h-6 w-px bg-[#1E2B58]/10 hidden md:block"></div>
        <div className="flex-grow min-w-[160px]">
          <select className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 cursor-pointer appearance-none">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <button className="navy-gradient-btn px-6 py-2.5 rounded-xl font-bold text-sm ml-auto">
          Apply Filters
        </button>
      </div>

      <div className="glass-card p-0 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#1E2B58] opacity-20" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E2B58]/5 dark:bg-white/5 border-b border-[#1E2B58]/10 dark:border-white/10">
                  <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Request ID</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Item / Subject</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Period / Date</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Status</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-[#1E2B58] dark:text-white divide-y divide-slate-100 dark:divide-white/5">
                {activeTab === 'borrow' && borrowRequests.length > 0 ? (
                  borrowRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-white/30 dark:hover:bg-white/5 transition-all">
                      <td className="py-5 px-6 font-mono text-xs opacity-80">#{req._id.slice(-8).toUpperCase()}</td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold">{(req.equipment_id as any)?.name || (req.room_id as any)?.name || 'Unknown Item'}</span>
                          <span className="text-[10px] opacity-60">{(req.equipment_id as any)?.category || (req.room_id as any)?.type || 'Equipment'}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-xs">
                        {new Date(req.borrow_date).toLocaleDateString()} - {new Date(req.return_date).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-6">
                        {renderStatusBadge(req.status)}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button className="w-8 h-8 rounded-full hover:bg-white/50 transition-colors ml-auto flex items-center justify-center">
                          <span className="material-symbols-rounded text-lg">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center opacity-50 font-bold">
                      No {activeTab} history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
