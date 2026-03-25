import React, { useEffect, useState } from 'react';
import { X, Laptop, FileText, AlertTriangle, Monitor, Cable, Router, Cpu, Mic, Camera, TabletSmartphone, MonitorCog, ArrowRight, Loader2 } from 'lucide-react';
import { borrowRequestService } from '@/services/borrowRequestService';
import { reportService } from '@/services/reportService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
 laptop: Laptop,
 pc_lab: Monitor,
 iot_kit: Cpu,
 tablet: TabletSmartphone,
 camera: Camera,
 audio: Mic,
 network: Router,
 cable: Cable,
 electrical: AlertTriangle,
 infrastructure: AlertTriangle,
 it_device: MonitorCog,
 other: FileText,
};

const STATUS_COLORS= {
 approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
 pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
 rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
 cancelled: 'bg-slate-200 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400',
 handed_over: 'bg-[#1E2B58] text-white',
 returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
 fixed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
 processing:'bg-[#1E2B58] text-white',
};

const SEVERITY_COLORS= {
 CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400',
 HIGH: 'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
 MEDIUM: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
 LOW: 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

// ─── Row helper ───────────────────────────────────────────────────────────────

const DetailRow = ({ label, value }) => (
 <div className="flex justify-between items-center text-sm py-2 border-b border-[#1E2B58]/[0.06] dark:border-white/[0.06] last:border-0">
 <span className="text-[#1E2B58]/55 dark:text-white/50 font-medium shrink-0">{label}</span>
 <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4 break-words max-w-[60%]">{value}</span>
 </div>
);

// ─── Borrow Detail ────────────────────────────────────────────────────────────

const BorrowDetail = ({ request, onClose }) => {
 const navigate = useNavigate();
 const { user } = useAuthStore();

 const eq = request.equipment_id;
 const rm = request.room_id;
 const assetName = (eq && typeof eq === 'object' ? eq.name : null) || (rm && typeof rm === 'object' ? rm.name : null) || 'Asset';
 const category = (eq && typeof eq === 'object' ? eq.category : null) || '';
 const Icon = CATEGORY_ICONS[category.toLowerCase()] || (rm ? Monitor : null);
 const shortId = `#REQ-${(request._id).slice(-6).toUpperCase()}`;

 const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

 return (
 <>
 {/* Header */}
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 rounded-[1rem] bg-[#1E2B58]/10 dark:bg-white/5 flex items-center justify-center shrink-0">
 <Icon className="w-6 h-6 text-[#1E2B58] dark:text-white" strokeWidth={1.5} />
 </div>
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Borrow Request Detail</p>
 <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{shortId}</h3>
 </div>
 </div>

 {/* Fields */}
 <div className="space-y-0 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] px-5 py-1 mb-6">
 <DetailRow label="Asset" value={assetName} />
 <DetailRow label="Type" value={request.type || '—'} />
 <DetailRow label="Borrow Date" value={fmt(request.borrow_date)} />
 <DetailRow label="Return Date" value={fmt(request.return_date)} />
 {request.note && <DetailRow label="Note" value={request.note} />}
 <div className="flex justify-between items-center text-sm py-2">
 <span className="text-[#1E2B58]/55 dark:text-white/50 font-medium">Status</span>
 <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[request.status] || 'bg-slate-200 text-slate-600'}`}>
 {request.status.replace('_', ' ')}
 </span>
 </div>
 {request.decision_note && (
 <div className="pt-2 border-t border-[#1E2B58]/10">
 <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[#1E2B58]/50 mb-1">Note</p>
 <p className="text-sm text-[#1E2B58] dark:text-white/90 font-medium bg-white/30 dark:bg-slate-900/30 p-3 rounded-xl border border-white/40">{request.decision_note}</p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="flex gap-3">
 <button onClick={() => { onClose(); navigate(`/${user?.role}/history`); }} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] transition-all flex items-center justify-center gap-2">
 View in History <ArrowRight className="w-3.5 h-3.5" />
 </button>
 <button onClick={onClose} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all">
 Close
 </button>
 </div>
 </>
 );
};

// ─── Report Detail ────────────────────────────────────────────────────────────

const ReportDetail = ({ report, onClose }) => {
 const navigate = useNavigate();
 const { user } = useAuthStore();

 const eq = report.equipment_id;
 const rm = report.room_id;
 const locationLabel = (rm && typeof rm === 'object' ? rm.name : null) || (eq && typeof eq === 'object' ? eq.name : null) || 'Unknown';
 const shortId = `#RPT-${report._id.slice(-6).toUpperCase()}`;

 const severityKey = ((report).severity || 'MEDIUM').toUpperCase();
 const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

 return (
 <>
 {/* Header */}
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 rounded-[1rem] bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
 <FileText className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
 </div>
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Report Detail</p>
 <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{shortId}</h3>
 </div>
 </div>

 {/* Fields */}
 <div className="space-y-0 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] px-5 py-1 mb-6">
 <DetailRow label="Category" value={report.type} />
 <DetailRow label="Location" value={locationLabel} />
 <DetailRow label="Date" value={fmt(report.createdAt)} />
 <div className="flex justify-between items-center text-sm py-2 border-b border-[#1E2B58]/[0.06]">
 <span className="text-[#1E2B58]/55 dark:text-white/50 font-medium">Severity</span>
 <span className={`text-[0.625rem] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${SEVERITY_COLORS[severityKey] || SEVERITY_COLORS['MEDIUM']}`}>
 {severityKey}
 </span>
 </div>
 <div className="flex justify-between items-center text-sm py-2 border-b border-[#1E2B58]/[0.06]">
 <span className="text-[#1E2B58]/55 dark:text-white/50 font-medium">Status</span>
 <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[report.status] || 'bg-slate-200 text-slate-600'}`}>
 {report.status}
 </span>
 </div>
 {report.description && (
 <div className="pt-2 border-t border-[#1E2B58]/10">
 <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[#1E2B58]/50 mb-1">Description</p>
 <p className="text-sm text-[#1E2B58] dark:text-white/90 font-medium bg-white/30 dark:bg-slate-900/30 p-3 rounded-xl border border-white/40 leading-relaxed">{report.description}</p>
 </div>
 )}
 {report.img && (
 <div className="pt-2 border-t border-[#1E2B58]/10">
 <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[#1E2B58]/50 mb-2">Evidence</p>
 <div className="rounded-xl overflow-hidden border border-[#1E2B58]/10 max-h-48 flex justify-center bg-black/5">
 <img src={report.img} alt="Evidence" className="object-contain max-h-48 w-full" />
 </div>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="flex gap-3">
 <button onClick={() => { onClose(); navigate(`/${user?.role}/history`); }} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] transition-all flex items-center justify-center gap-2">
 View in History <ArrowRight className="w-3.5 h-3.5" />
 </button>
 <button onClick={onClose} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all">
 Close
 </button>
 </div>
 </>
 );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const NotificationDetailModal = ({ entityType, entityId, onClose }) => {
 const [borrowData, setBorrowData] = useState(null);
 const [reportData, setReportData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 let cancelled = false;
 setLoading(true);
 setError(null);

 const fetch = async () => {
 try {
 if (entityType === 'borrow') {
 const data = await borrowRequestService.getBorrowRequestById(entityId);
 if (!cancelled) setBorrowData(data);
 } else {
 const data = await reportService.getById(entityId);
 if (!cancelled) setReportData(data);
 }
 } catch (e) {
 if (!cancelled) setError(e?.response?.data?.message || 'Failed to load details.');
 } finally {
 if (!cancelled) setLoading(false);
 }
 };

 fetch();
 return () => { cancelled = true; };
 }, [entityType, entityId]);

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
 onClick={e => { if (e.target === e.currentTarget) onClose(); }}
 >
 <div className="glass-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 {/* Close */}
 <button
 onClick={onClose}
 className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
 >
 <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
 </button>

 {loading ? (
 <div className="flex flex-col items-center justify-center gap-4 py-16">
 <Loader2 className="w-8 h-8 animate-spin text-[#1E2B58]/40" />
 <p className="text-sm font-bold text-[#1E2B58]/40 uppercase tracking-wider">Loading details…</p>
 </div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center gap-4 py-16">
 <AlertTriangle className="w-8 h-8 text-red-400" />
 <p className="text-sm font-bold text-red-500">{error}</p>
 <button onClick={onClose} className="mt-2 px-6 py-2 rounded-full bg-[#1E2B58] text-white text-xs font-bold hover:scale-105 transition">Close</button>
 </div>
 ) : (
 <>
 {entityType === 'borrow' && borrowData && (
 <BorrowDetail request={borrowData} onClose={onClose} />
 )}
 {entityType === 'report' && reportData && (
 <ReportDetail report={reportData} onClose={onClose} />
 )}
 </>
 )}
 </div>
 </div>
 );
};

export default NotificationDetailModal;
