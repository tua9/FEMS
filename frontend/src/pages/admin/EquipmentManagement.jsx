import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import EquipmentTable from '../../components/admin/equipment/EquipmentTable';
import BrokenAttentionCard from '../../components/admin/equipment/BrokenAttentionCard';
import AddEquipmentModal from '../../components/admin/equipment/AddEquipmentModal';
import EquipmentQRCodeModal from '../../components/admin/equipment/EquipmentQRCodeModal';
import EquipmentDetailsModal from '../../components/admin/equipment/EquipmentDetailsModal';
import DeleteConfirmationModal from '../../components/admin/common/DeleteConfirmationModal';
import Pagination from '../../components/shared/Pagination';
import { useEquipmentStore } from '../../stores/useEquipmentStore';
import { getDerivedStatus } from '../../utils/equipmentHelpers';
import { borrowRequestService } from '../../services/borrowRequestService';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';

const EquipmentManagement = () => {
 const location = useLocation();
 const equipments = useEquipmentStore(state => state.equipments);
 const loading = useEquipmentStore(state => state.loading);
 const fetchAll = useEquipmentStore(state => state.fetchAll);
 const deleteEquipment = useEquipmentStore(state => state.deleteEquipment);
 const updateEquipment = useEquipmentStore(state => state.updateEquipment);

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [selectedEquipment, setSelectedEquipment] = useState(null);
 const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
 const [qrEquipment, setQrEquipment] = useState(null);
 const [equipmentToDelete, setEquipmentToDelete] = useState(null);
 const [activeRequests, setActiveRequests] = useState([]);

 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState('All Status');
 const [categoryFilter, setCategoryFilter] = useState('All Categories');
 const [sortBy, setSortBy] = useState('Newest');
 const [currentPage, setCurrentPage] = useState(1);
 const ITEMS_PER_PAGE = 5;

 useEffect(() => {
 if (location.state && (location.state).status) {
 setStatusFilter((location.state).status);
 }
 }, [location.state]);

 useEffect(() => {
 fetchAll();
 borrowRequestService.getAllBorrowRequests().then(reqs => {
 setActiveRequests(reqs);
 }).catch(console.error);
 }, [fetchAll]);

 // Reset to page 1 when filters change
 useEffect(() => {
 setCurrentPage(1);
 }, [searchQuery, statusFilter, categoryFilter, sortBy]);

 const handleOpenDetails = (asset) => {
 setSelectedEquipment(asset);
 setIsDetailModalOpen(true);
 };

 const handleOpenQRCode = (asset) => setQrEquipment(asset);
 const handleEditEquipment = (asset) => handleOpenDetails(asset);
 const handleDeleteClick = (asset) => setEquipmentToDelete(asset);

 const confirmDelete = async () => {
 if (equipmentToDelete) {
 await deleteEquipment(equipmentToDelete._id);
 setEquipmentToDelete(null);
 }
 };

 const handleUpdateStatus = async (id, newStatus) => {
 await updateEquipment(id, { status: newStatus });
 };

 // Broken components for attention
 const brokenAttention = equipments.filter(e => e.status === 'broken' || e.status === 'maintenance').slice(0, 5);

 const categories = Array.from(new Set(equipments.map(e => e.category)));
 const statuses = ['Available', 'Borrowed', 'Maintenance', 'Broken'];

 const filteredEquipments = equipments
 .filter(item => {
 const vStatus = getDerivedStatus(item, activeRequests);
 const q = searchQuery.toLowerCase();
 const matchesSearch =
 item.name.toLowerCase().includes(q) ||
 item._id.toLowerCase().includes(q) ||
 item.category.toLowerCase().includes(q) ||
 (item.model || '').toLowerCase().includes(q) ||
 (item.serial_number || '').toLowerCase().includes(q);
 let matchesStatus = statusFilter === 'All Status';
 if (!matchesStatus) {
 if (statusFilter === 'Available') {
 matchesStatus = vStatus === 'Available' || vStatus === 'Reserved';
 } else if (statusFilter === 'Borrowed') {
 matchesStatus = vStatus === 'In Use';
 } else if (statusFilter === 'Maintenance') {
 matchesStatus = vStatus === 'Maintenance';
 } else if (statusFilter === 'Broken') {
 matchesStatus = vStatus === 'Broken';
 }
 }
 const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
 return matchesSearch && matchesStatus && matchesCategory;
 })
 .sort((a, b) => {
 if (sortBy === 'Name') return a.name.localeCompare(b.name);
 if (sortBy === 'Status') {
 const sA = getDerivedStatus(a, activeRequests);
 const sB = getDerivedStatus(b, activeRequests);
 return sA.localeCompare(sB);
 }
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

 const isBlurred = isAddModalOpen || isDetailModalOpen || !!qrEquipment || !!equipmentToDelete;

 return (
 <div className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-16 relative z-0">
 <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
 <div className="mb-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
 <PageHeader
 title="Equipment Management"
 subtitle="Track, manage and audit university assets and hardware."
 className="items-start text-left mb-0!"
 />
 <button
 onClick={() => { setSelectedEquipment(null); setIsAddModalOpen(true); }}
 className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-semibold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10 shrink-0"
 >
 <span className="material-symbols-outlined text-lg">add</span>
 Add Equipment
 </button>
 </div>

 <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
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
 <div className="dashboard-card rounded-3xl flex items-center gap-0 p-1">
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
 { value: 'Name', label: 'Sort: Name' },
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
 onEdit={handleEditEquipment}
 onDelete={handleDeleteClick}
 onReportDamage={(item) => handleUpdateStatus(item._id, 'broken')}
 activeRequests={activeRequests}
 />

 <div className="mt-8 flex items-center justify-between px-2">
 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
 Showing {Math.min(filteredEquipments.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(filteredEquipments.length, currentPage * ITEMS_PER_PAGE)} of {filteredEquipments.length} assets
 </p>
 <Pagination
 currentPage={currentPage}
 totalPages={totalPages}
 onPageChange={setCurrentPage}
 />
 </div>
 </div>

 <BrokenAttentionCard
 items={brokenAttention}
 onViewDetails={handleOpenDetails}
 onUpdateStatus={handleUpdateStatus}
 onViewAll={() => {
 setStatusFilter('Broken');
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }}
 />
 </div>

 <AddEquipmentModal
 isOpen={isAddModalOpen}
 onClose={() => setIsAddModalOpen(false)}
 equipment={selectedEquipment}
 onEquipmentUpdated={fetchAll}
 onCreated={(eq) => {
 setIsAddModalOpen(false);
 setSelectedEquipment(null);
 fetchAll();
 setQrEquipment(eq);
 }}
 />
 <EquipmentDetailsModal isOpen={isDetailModalOpen} equipment={selectedEquipment} onClose={() => setIsDetailModalOpen(false)} onEdit={(e) => { setIsDetailModalOpen(false); setSelectedEquipment(e); setIsAddModalOpen(true); }} onReportDamage={(e) => handleUpdateStatus(e._id, 'broken')} />
 <EquipmentQRCodeModal isOpen={!!qrEquipment} equipment={qrEquipment} onClose={() => setQrEquipment(null)} />
 <DeleteConfirmationModal isOpen={!!equipmentToDelete} title="Decommission Equipment" message="Are you sure you want to remove this equipment?" itemName={equipmentToDelete?.name} onClose={() => setEquipmentToDelete(null)} onConfirm={confirmDelete} />
 </div>
 );
};

export default EquipmentManagement;
