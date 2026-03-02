import React, { useEffect, useState } from 'react';
import EquipmentTable from '../../components/admin/equipment/EquipmentTable';
import BrokenAttentionCard from '../../components/admin/equipment/BrokenAttentionCard';
import AddEquipmentModal from '../../components/admin/equipment/AddEquipmentModal';
import EquipmentQRCodeModal from '../../components/admin/equipment/EquipmentQRCodeModal';
import { adminApi } from '../../services/api/adminApi';
import { Asset } from '../../types/admin.types';

const EquipmentManagement: React.FC = () => {
    const [equipments, setEquipments] = useState<Asset[]>([]);
    const [brokenAttention, setBrokenAttention] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Asset | null>(null);
    const [qrDevice, setQrDevice] = useState<Asset | null>(null);

    useEffect(() => {
        const fetchEquipmentData = async () => {
            try {
                const [equipmentsData, brokenData] = await Promise.all([
                    adminApi.getEquipmentList(),
                    adminApi.getBrokenEquipmentAttention()
                ]);
                setEquipments(equipmentsData);
                setBrokenAttention(brokenData);
            } catch (error) {
                console.error("Failed to fetch equipment data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipmentData();
    }, []);

    const handleOpenDetails = (asset: Asset) => {
        setSelectedDevice(asset);
    };

    const handleOpenQRCode = (asset: Asset) => {
        setQrDevice(asset);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative z-0">
            {/* Blurring background when modal is open based on HTML design */}
            <div className={`transition-all duration-300 ${isAddModalOpen || selectedDevice || qrDevice ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">Equipment Management</h2>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">Track, manage and audit university assets and hardware.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Equipment
                    </button>
                </div>

                <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="relative max-w-md w-full bg-white/60 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 p-0.5">
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-sm font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                    placeholder="Search equipment by name, ID or category..."
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                                Filters
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                <span className="material-symbols-outlined text-lg">sort</span>
                                Sort
                            </button>
                        </div>
                    </div>

                    <EquipmentTable
                        equipments={equipments}
                        onOpenDetails={handleOpenDetails}
                        onOpenQRCode={handleOpenQRCode}
                    />

                    <div className="mt-8 flex items-center justify-between px-2">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Showing 1-10 of 1,248 assets</p>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all">
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A2B56] text-white shadow-md font-bold text-sm">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all font-bold text-sm">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all font-bold text-sm">3</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <BrokenAttentionCard items={brokenAttention} />
            </div>

            {/* Modals - Moved outside of the blur wrapper to ensure they are on top of everything including sticky navbars which might create new stacking contexts */}
            <AddEquipmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EquipmentQRCodeModal
                isOpen={!!qrDevice}
                equipment={qrDevice}
                onClose={() => setQrDevice(null)}
            />
        </div>
    );
};

export default EquipmentManagement;
