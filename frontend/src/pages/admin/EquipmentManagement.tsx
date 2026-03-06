import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import EquipmentTable from '../../components/admin/equipment/EquipmentTable';
import BrokenAttentionCard from '../../components/admin/equipment/BrokenAttentionCard';
import AddEquipmentModal from '../../components/admin/equipment/AddEquipmentModal';
import EquipmentQRCodeModal from '../../components/admin/equipment/EquipmentQRCodeModal';
import DeviceDetailsModal from '../../components/admin/equipment/DeviceDetailsModal';
import DeleteConfirmationModal from '../../components/admin/common/DeleteConfirmationModal';
import { adminApi } from '../../services/api/adminApi';
import { Asset } from '../../types/admin.types';
import { useLocation } from 'react-router-dom';

const EquipmentManagement: React.FC = () => {
    const location = useLocation();
    const [equipments, setEquipments] = useState<Asset[]>([]);
    const [brokenAttention, setBrokenAttention] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Asset | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [qrDevice, setQrDevice] = useState<Asset | null>(null);
    const [deviceToDelete, setDeviceToDelete] = useState<Asset | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [sortBy, setSortBy] = useState('Newest');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (location.state && (location.state as any).status) {
            setStatusFilter((location.state as any).status);
        }
    }, [location.state]);

    const fetchEquipmentData = React.useCallback(async () => {
        try {
            const [equipmentsData, brokenData] = await Promise.all([
                adminApi.getEquipmentList(),
                adminApi.getBrokenEquipmentAttention()
            ]);
            setEquipments([...equipmentsData]);
            setBrokenAttention([...brokenData]);
        } catch (error) {
            console.error("Failed to fetch equipment data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEquipmentData();
    }, [fetchEquipmentData]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, categoryFilter, sortBy]);

    const handleOpenDetails = (asset: Asset) => {
        setSelectedDevice(asset);
        setIsDetailModalOpen(true);
    };

    const handleOpenQRCode = (asset: Asset) => setQrDevice(asset);
    const handleEditDevice = (asset: Asset) => handleOpenDetails(asset);
    const handleDeleteClick = (asset: Asset) => setDeviceToDelete(asset);

    const confirmDelete = () => {
        if (deviceToDelete) {
            setEquipments(prev => prev.filter(e => e.id !== deviceToDelete.id));
            setDeviceToDelete(null);
        }
    };

    const handleUpdateStatus = (id: string, newStatus: Asset['status']) => {
        setEquipments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    };

    // Keep brokenAttention in sync with equipments for demo purposes
    useEffect(() => {
        const brokenItems = equipments.filter(e => e.status === 'Broken' || e.status === 'Repairing').slice(0, 5);
        setBrokenAttention(brokenItems);
    }, [equipments]);

    const categories = Array.from(new Set(equipments.map(e => e.category)));
    const statuses = ['Available', 'In Use', 'Maintenance', 'Broken', 'Repairing', 'Decommissioned'];

    const filteredEquipments = equipments
        .filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
            const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'Status') return a.status.localeCompare(b.status);
            return 0;
        });

    const totalPages = Math.ceil(filteredEquipments.length / ITEMS_PER_PAGE);
    const paginatedEquipments = filteredEquipments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const isBlurred = isAddModalOpen || isDetailModalOpen || qrDevice || !!deviceToDelete;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative z-0">
            <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">Equipment Management</h2>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 font-medium">Track, manage and audit university assets and hardware.</p>
                    </div>
                    <button
                        onClick={() => { setSelectedDevice(null); setIsAddModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-semibold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10"
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
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-xs font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                    placeholder="Search equipment..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dropdown Section */}
                        <div className="glass-card !rounded-[1.5rem] flex items-center gap-0 p-1">
                            <CustomDropdown
                                value={categoryFilter}
                                options={[
                                    { value: 'All Categories', label: 'All Categories' },
                                    ...categories.map(c => ({ value: c, label: c })),
                                ]}
                                onChange={setCategoryFilter}
                                align="left"
                            />

                            <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                            <CustomDropdown
                                value={statusFilter}
                                options={[
                                    { value: 'All Status', label: 'All Status' },
                                    ...statuses.map(s => ({ value: s, label: s })),
                                ]}
                                onChange={setStatusFilter}
                                align="left"
                            />

                            <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                            <CustomDropdown
                                value={sortBy}
                                options={[
                                    { value: 'Newest', label: 'Sort: Newest' },
                                    { value: 'Name',   label: 'Sort: Name'   },
                                    { value: 'Status', label: 'Sort: Status' },
                                ]}
                                onChange={setSortBy}
                                align="right"
                            />

                            <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('All Status'); setCategoryFilter('All Categories'); setSortBy('Newest'); }}
                                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Reset filters"
                            >
                                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                            </button>
                        </div>
                    </div>

                    <EquipmentTable
                        equipments={paginatedEquipments}
                        onOpenDetails={handleOpenDetails}
                        onOpenQRCode={handleOpenQRCode}
                        onEdit={handleEditDevice}
                        onDelete={handleDeleteClick}
                        onReportDamage={(item) => handleUpdateStatus(item.id, 'Broken')}
                    />

                    <div className="mt-8 flex items-center justify-between px-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Showing {Math.min(filteredEquipments.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredEquipments.length, currentPage * ITEMS_PER_PAGE)} of {filteredEquipments.length} assets
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-opacity ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600'}`}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${currentPage === page ? 'bg-[#1A2B56] text-white shadow-md' : 'bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-opacity ${currentPage === totalPages || totalPages === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600'}`}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                <BrokenAttentionCard
                    items={brokenAttention}
                    onViewDetails={handleOpenDetails}
                    onUpdateStatus={handleUpdateStatus}
                    onViewAll={() => {
                        // Scroll to table and set status filter to "Broken" for a quick "View All"
                        setStatusFilter('Broken');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </div>

            <AddEquipmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} equipment={selectedDevice} onEquipmentUpdated={fetchEquipmentData} />
            <DeviceDetailsModal isOpen={isDetailModalOpen} device={selectedDevice} onClose={() => setIsDetailModalOpen(false)} onEdit={(d) => { setIsDetailModalOpen(false); setSelectedDevice(d); setIsAddModalOpen(true); }} onReportDamage={(d) => handleUpdateStatus(d.id, 'Broken')} />
            <EquipmentQRCodeModal isOpen={!!qrDevice} equipment={qrDevice} onClose={() => setQrDevice(null)} />
            <DeleteConfirmationModal isOpen={!!deviceToDelete} title="Decommission Equipment" message="Are you sure you want to remove this equipment?" itemName={deviceToDelete?.name} onClose={() => setDeviceToDelete(null)} onConfirm={confirmDelete} />
        </div>
    );
};

export default EquipmentManagement;