import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Scan, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { useEquipmentStore } from '@/stores/useEquipmentStore';

import { Monitor, Armchair, MoreHorizontal } from 'lucide-react';
import { type IssueCategory } from './ReportManualForm';

export interface QRResult {
    equipmentId: string;
    equipmentName: string;
    roomId: string;
    locationName: string;
    category: IssueCategory;
    description: string;
}

interface QuickScanReportProps {
    onQRDetected: (result: QRResult) => void;
}

const CATEGORY_ICONS: Record<IssueCategory, React.ElementType> = {
    equipment: Monitor,
    infrastructure: Armchair,
    other: MoreHorizontal,
};

type ScanState = 'scanning' | 'detected' | 'error';

export const QuickScanReport: React.FC<QuickScanReportProps> = ({ onQRDetected }) => {
    const [showModal, setShowModal] = useState(false);
    const [scanState, setScanState] = useState<ScanState>('scanning');
    const [scannedItem, setScannedItem] = useState<QRResult | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { equipments } = useEquipmentStore();

    // Simulate QR scanning
    useEffect(() => {
        if (showModal && scanState === 'scanning') {
            timerRef.current = setTimeout(() => {
                let item: QRResult | null = null;

                if (equipments && equipments.length > 0) {
                    // Pick a random equipment
                    const randomEq = equipments[Math.floor(Math.random() * equipments.length)];

                    let cat: IssueCategory = "other";
                    const eqCat = (randomEq.category || "").toLowerCase();
                    if (eqCat.includes('it') || eqCat.includes('computer') || eqCat.includes('laptop')) cat = 'equipment';
                    else if (eqCat.includes('furniture') || eqCat.includes('desk') || eqCat.includes('chair')) cat = 'infrastructure';
                    else if (eqCat.includes('electric') || eqCat.includes('power')) cat = 'infrastructure';
                    else if (eqCat.includes('plumb') || eqCat.includes('water') || eqCat.includes('ac')) cat = 'infrastructure';

                    let roomId = '';
                    let locationName = 'Unknown Location';

                    if (randomEq.room_id) {
                        if (typeof randomEq.room_id === 'string') {
                            roomId = randomEq.room_id;
                        } else {
                            roomId = randomEq.room_id._id;
                            locationName = randomEq.room_id.name;
                        }
                    }

                    item = {
                        equipmentId: randomEq._id,
                        equipmentName: randomEq.name,
                        roomId: roomId,
                        locationName: locationName,
                        category: cat,
                        description: `Issue with ${randomEq.name}`
                    };
                }

                if (item && item.roomId) {
                    setScannedItem(item);
                    setScanState('detected');
                } else {
                    setScanState('error');
                }
            }, 2000);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [showModal, scanState, equipments]);

    const openModal = () => {
        setScanState('scanning');
        setScannedItem(null);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleRetry = () => {
        setScanState('scanning');
        setScannedItem(null);
    };

    const handleUseResult = () => {
        if (!scannedItem) return;
        onQRDetected(scannedItem);
        closeModal();
    };

    const CategoryIcon = scannedItem ? CATEGORY_ICONS[scannedItem.category] : QrCode;

    return (
        <>
            <div className="dashboard-card p-[1.5rem] mb-[2rem] flex flex-col sm:flex-row items-center justify-between rounded-[2rem] gap-[1rem]">
                <div className="flex items-center gap-[1rem]">
                    <div className="w-[3rem] h-[3rem] bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[1rem] flex items-center justify-center shrink-0">
                        <Scan className="text-[#1E2B58] dark:text-slate-300 w-[1.5rem] h-[1.5rem]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1E2B58] dark:text-white">Quick Scan Report</h3>
                        <p className="text-[0.75rem] text-slate-500 dark:text-slate-400">Scan QR code on equipment to report instantly</p>
                    </div>
                </div>
                <button
                    onClick={openModal}
                    className="bg-[#1E2B58] text-white px-[1.5rem] py-[0.625rem] rounded-xl font-bold text-[0.875rem] flex items-center gap-[0.5rem] transition-all hover:bg-[#1E2B58]/90 hover:scale-105 active:scale-95 whitespace-nowrap shadow-md"
                >
                    <QrCode className="w-[1.125rem] h-[1.125rem]" strokeWidth={2.5} />
                    Scan QR Code
                </button>
            </div>

            {/* ── QR Scan Modal ──────────────────────────────────────────────── */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="dashboard-card rounded-[2rem] p-8 w-full max-w-sm shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Close */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
                        >
                            <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
                        </button>

                        <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Quick Scan</p>
                        <h3 className="text-xl font-black text-[#1E2B58] dark:text-white mb-6">
                            {scanState === 'scanning' ? 'Scanning QR Code…'
                                : scanState === 'error' ? 'Scan Failed'
                                    : 'Equipment Detected'}
                        </h3>

                        {/* Camera frame */}
                        <div className="relative w-full aspect-square max-w-[14rem] mx-auto mb-6 rounded-[1.5rem] bg-[#1E2B58]/5 dark:bg-slate-800/60 border-2 border-[#1E2B58]/10 dark:border-white/10 overflow-hidden flex items-center justify-center">
                            {scanState === 'scanning' ? (
                                <>
                                    {/* Corner brackets */}
                                    {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 right-3 rotate-180', 'bottom-3 left-3 -rotate-90'].map((pos, i) => (
                                        <div key={i} className={`absolute ${pos} w-6 h-6 border-t-2 border-l-2 border-[#1E2B58] dark:border-white rounded-tl`} />
                                    ))}
                                    {/* Animated scan line */}
                                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1E2B58] dark:via-sky-400 to-transparent animate-[scanLine_1.5s_ease-in-out_infinite]" style={{ animation: 'scanDown 1.5s ease-in-out infinite' }} />
                                    <style>{`@keyframes scanDown { 0%{top:10%} 50%{top:85%} 100%{top:10%} }`}</style>
                                    <QrCode className="w-16 h-16 text-[#1E2B58]/20 dark:text-white/20" />
                                    <p className="absolute bottom-3 text-[0.625rem] font-bold text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest">Detecting…</p>
                                </>
                            ) : scanState === 'error' ? (
                                <div className="flex flex-col items-center gap-3 p-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <X className="w-8 h-8 text-red-500" />
                                    </div>
                                    <p className="text-sm text-slate-500">No equipment found matching QR code, or equipment has no room assigned.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 p-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <CategoryIcon className="w-8 h-8 text-[#1E2B58] dark:text-white" />
                                </div>
                            )}
                        </div>

                        {/* Detected info */}
                        {scanState === 'detected' && scannedItem && (
                            <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-5 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-xs">Equipment</span>
                                    <span className="font-bold text-[#1E2B58] dark:text-white text-xs truncate max-w-[12rem]">{scannedItem.equipmentName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-xs">Asset ID</span>
                                    <span className="font-bold text-[#1E2B58] dark:text-white text-xs truncate max-w-[12rem]">{scannedItem.equipmentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-xs">Location</span>
                                    <span className="font-bold text-[#1E2B58] dark:text-white text-xs truncate max-w-[12rem]">{scannedItem.locationName}</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleRetry}
                                className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                {scanState === 'scanning' ? 'Cancel' : 'Retry'}
                            </button>
                            {scanState === 'detected' && (
                                <button
                                    onClick={handleUseResult}
                                    className="flex-[2] py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
                                >
                                    Use This Equipment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
