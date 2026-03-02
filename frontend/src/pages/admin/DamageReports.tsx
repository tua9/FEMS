import React, { useEffect, useState } from 'react';
import DamageReportTable from '../../components/admin/reports/DamageReportTable';
import ResolutionStats from '../../components/admin/reports/ResolutionStats';
import { adminApi } from '../../services/api/adminApi';
import { DamageReport } from '../../types/admin.types';

const DamageReports: React.FC = () => {
    const [reports, setReports] = useState<DamageReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                const reportsData = await adminApi.getDamageReports();
                setReports(reportsData);
            } catch (error) {
                console.error("Failed to fetch reports data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const openReports = reports.filter(r => r.status === 'Open').length;
    const resolvedReports = reports.filter(r => r.status === 'Resolved').length;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">Damage Reports & Issues</h2>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">Track equipment issues, track maintenance and assign technicians.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-white rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-600">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Export Data
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-red-500 mb-1">Open Reports</p>
                        <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{openReports}</h3>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-2xl text-red-500">
                        <span className="material-symbols-outlined text-3xl">report_problem</span>
                    </div>
                </div>
                <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 mb-1">Resolved (This Month)</p>
                        <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{resolvedReports}</h3>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl text-emerald-500">
                        <span className="material-symbols-outlined text-3xl">task_alt</span>
                    </div>
                </div>
                <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-amber-200 dark:border-amber-800 bg-amber-50/50">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">Critical Issues</p>
                        <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-amber-500">2</h3>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-2xl text-amber-600">
                        <span className="material-symbols-outlined text-3xl">warning</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Table Area */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Report Management</h4>

                            <div className="flex items-center gap-3">
                                <div className="relative w-full sm:w-64 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 p-0.5">
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-3 text-slate-400 text-sm">search</span>
                                        <input
                                            className="w-full pl-9 pr-3 py-2 bg-transparent border-none rounded-xl text-xs font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                            placeholder="Search report ID, equipment..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <button className="flex items-center justify-center p-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                    <span className="material-symbols-outlined text-sm">filter_list</span>
                                </button>
                            </div>
                        </div>

                        <DamageReportTable reports={reports} />

                        <div className="mt-8 flex items-center justify-between px-2">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Showing 1-10 of 42 reports</p>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all">
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A2B56] text-white shadow-md font-bold text-sm">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all font-bold text-sm">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all">
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="xl:col-span-1">
                    <ResolutionStats />
                </div>
            </div>
        </div>
    );
};

export default DamageReports;
