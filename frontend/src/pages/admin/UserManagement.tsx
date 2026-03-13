import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import UserTable from '../../components/admin/users/UserTable';
import AddUserModal from '../../components/admin/users/AddUserModal';
import UserDetailModal from '../../components/admin/users/UserDetailModal';
import DeleteConfirmationModal from '../../components/admin/common/DeleteConfirmationModal';
import ActionConfirmationModal from '../../components/admin/common/ActionConfirmationModal';
import { adminApi } from '../../services/api/adminApi';
import type { AdminUser } from '../../types/admin.types';
import { PageHeader } from '@/components/shared/PageHeader';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [userToToggle, setUserToToggle] = useState<AdminUser | null>(null);

    // Filter and Pagination states
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const [isExporting, setIsExporting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchUserData = React.useCallback(async () => {
        try {
            // Generating mock data as requested
            const mockUsers: AdminUser[] = [
                // Super Admin
                { id: 'AdminUser-0001', name: 'Dr. Alex Rivers', email: 'alex.rivers@fems.edu.vn', role: 'Super Admin' as const, status: 'Active', phone: '0901234567', department: 'Management' },

                // 2 Technicians
                ...Array.from({ length: 2 }).map((_, i) => ({
                    id: `TECH-${(i + 1).toString().padStart(4, '0')}`,
                    name: `Technician ${i + 1}`,
                    email: `tech${i + 1}@fems.edu.vn`,
                    role: 'Technician' as const,
                    status: 'Active' as const,
                    phone: `09123456${i.toString().padStart(2, '0')}`,
                    department: 'Technical'
                })),

                // 10 Lecturers
                ...Array.from({ length: 10 }).map((_, i) => ({
                    id: `LECT-${(i + 1).toString().padStart(4, '0')}`,
                    name: `Lecturer ${i + 1}`,
                    email: `lecturer${i + 1}@fems.edu.vn`,
                    role: 'Lecturer' as const,
                    status: 'Active' as const,
                    phone: `09223456${i.toString().padStart(2, '0')}`,
                    department: 'Academic'
                })),

                // 30 Students
                ...Array.from({ length: 30 }).map((_, i) => ({
                    id: `STUD-${(i + 1).toString().padStart(4, '0')}`,
                    name: `Student ${i + 1}`,
                    email: `student${i + 1}@fems.edu.vn`,
                    role: 'Student' as const,
                    status: (i % 5 === 0) ? 'Inactive' as const : 'Active' as const,
                    phone: `09323456${i.toString().padStart(2, '0')}`,
                    department: 'Engineering'
                }))
            ];

            setUsers(mockUsers);
        } catch (error) {
            console.error("Failed to fetch AdminUser data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleOpenDetails = (AdminUser: AdminUser) => {
        setSelectedUser(AdminUser);
        setIsDetailModalOpen(true);
    };

    const handleEditUser = (AdminUser: AdminUser) => {
        handleOpenDetails(AdminUser);
    };

    const handleDeleteClick = (AdminUser: AdminUser) => {
        setUserToDelete(AdminUser);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
            // In a real app, call API here
        }
    };

    const handleToggleStatus = (AdminUser: AdminUser) => {
        setUserToToggle(AdminUser);
    };

    const confirmToggleStatus = () => {
        if (userToToggle) {
            const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active';
            setUsers(prev => prev.map(u =>
                u.id === userToToggle.id ? { ...u, status: newStatus as any } : u
            ));
            setUserToToggle(null);
            // In a real app, call API here
        }
    };

    const handleExportData = () => {
        setIsExporting(true);
        // Simulate CSV generation
        const headers = "ID,Name,Email,Role,Status\n";
        const rows = users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `FEMS_Users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => setIsExporting(false), 800);
    };

    const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`Draft: Import functionality for "${file.name}" would process ${file.size} bytes. (Backend required for full implementation)`);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredUsers = users.filter(AdminUser => {
        const matchesSearch = AdminUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            AdminUser.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            AdminUser.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || AdminUser.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || AdminUser.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const currentUsers = filteredUsers.slice(
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

    const activeUsers = users.filter(u => u.status === 'Active').length;
    const inactiveUsers = users.filter(u => u.status === 'Inactive').length;

    const isBlurred = isAddModalOpen || isDetailModalOpen || !!userToDelete || !!userToToggle;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
                    <PageHeader
                        title="System Users"
                        subtitle="Manage staff, students and administrative accounts."
                        className="items-start! text-left! mb-0!"
                    />
                    <div className="flex items-center gap-3 shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleBulkImport}
                            accept=".csv"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-slate-200 rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <span className="material-symbols-outlined text-lg">group</span>
                            Bulk Import
                        </button>
                        <button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-slate-200 rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">{isExporting ? 'hourglass_top' : 'download'}</span>
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            onClick={() => { setSelectedUser(null); setIsAddModalOpen(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10"
                        >
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Add AdminUser
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Total Users Card */}
                    <button
                        onClick={() => { setRoleFilter('All'); setStatusFilter('All'); }}
                        className={`dashboard-card p-5 rounded-2xl transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-95 text-left
                            ${roleFilter === 'All' && statusFilter === 'All'
                                ? 'ring-2 ring-blue-500/20'
                                : ''}`}
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">Total Users</p>
                            <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{users.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 transition-all duration-300">
                            <span className="material-symbols-outlined">manage_accounts</span>
                        </div>
                    </button>

                    {/* Active Users Card */}
                    <button
                        onClick={() => { setRoleFilter('All'); setStatusFilter('Active'); }}
                        className={`dashboard-card p-5 rounded-2xl transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-95 text-left
                            ${statusFilter === 'Active'
                                ? 'ring-2 ring-emerald-500/20'
                                : ''}`}
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500 mb-1">Active</p>
                            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{activeUsers}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 transition-all duration-300">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </button>

                    {/* Technicians Card */}
                    <button
                        onClick={() => { setRoleFilter('Technician'); setStatusFilter('All'); }}
                        className={`dashboard-card p-5 rounded-2xl transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-95 text-left
                            ${roleFilter === 'Technician'
                                ? 'ring-2 ring-amber-500/20'
                                : ''}`}
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">Technicians</p>
                            <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">
                                {users.filter(u => u.role === 'Technician').length}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 transition-all duration-300">
                            <span className="material-symbols-outlined">engineering</span>
                        </div>
                    </button>

                    {/* Inactive Users Card */}
                    <button
                        onClick={() => { setRoleFilter('All'); setStatusFilter('Inactive'); }}
                        className={`dashboard-card p-5 rounded-2xl transition-all duration-300 flex items-center justify-between hover:scale-[1.02] active:scale-95 text-left
                            ${statusFilter === 'Inactive'
                                ? 'ring-2 ring-red-500/20'
                                : ''}`}
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-red-500 mb-1">Inactive</p>
                            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight">{inactiveUsers}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">person_off</span>
                        </div>
                    </button>
                </div>

                <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="relative max-w-sm w-full bg-white/60 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 p-0.5">
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-xs font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                    placeholder="Search AdminUser by name, email or ID..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="dashboard-card rounded-3xl! flex items-center gap-0 p-1">
                            <CustomDropdown
                                value={roleFilter}
                                options={[
                                    { value: 'All', label: 'Role: All' },
                                    { value: 'Student', label: 'Student' },
                                    { value: 'Lecturer', label: 'Lecturer' },
                                    { value: 'Technician', label: 'Technician' },
                                    { value: 'Manager', label: 'Manager' },
                                    { value: 'Super Admin', label: 'Super Admin' },
                                ]}
                                onChange={setRoleFilter}
                                align="right"
                            />

                            <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                            <button
                                onClick={() => { setSearchQuery(''); setRoleFilter('All'); setStatusFilter('All'); }}
                                className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Reset filters"
                            >
                                <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                            </button>
                        </div>
                    </div>

                    <UserTable
                        users={currentUsers}
                        onOpenDetails={handleOpenDetails}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteClick}
                        onToggleStatus={handleToggleStatus}
                    />

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                Showing <span className="text-[#1A2B56] dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#1A2B56] dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-[#1A2B56] dark:text-white">{filteredUsers.length}</span> users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>

                                <div className="flex items-center gap-1.5 mx-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm
                                                ${currentPage === i + 1
                                                    ? 'bg-[#1A2B56] text-white'
                                                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                AdminUser={selectedUser}
                onUserUpdated={fetchUserData}
            />

            <UserDetailModal
                isOpen={isDetailModalOpen}
                AdminUser={selectedUser}
                onClose={() => setIsDetailModalOpen(false)}
                onEdit={(AdminUser) => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(AdminUser);
                    setIsAddModalOpen(true);
                }}
                onUpdate={fetchUserData}
            />

            <DeleteConfirmationModal
                isOpen={!!userToDelete}
                title="Remove AdminUser Account"
                message="Are you sure you want to remove this AdminUser from the system? This action cannot be undone."
                itemName={userToDelete?.name}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
            />

            <ActionConfirmationModal
                isOpen={!!userToToggle}
                title={userToToggle?.status === 'Active' ? "Deactivate AdminUser Account" : "Activate AdminUser Account"}
                message={userToToggle?.status === 'Active'
                    ? "Are you sure you want to deactivate this account? The AdminUser will no longer be able to sign in."
                    : "Are you sure you want to reactivate this account? The AdminUser will regain access to the system."}
                itemName={userToToggle?.name}
                confirmText={userToToggle?.status === 'Active' ? "Deactivate" : "Activate"}
                confirmColor={userToToggle?.status === 'Active' ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"}
                icon={userToToggle?.status === 'Active' ? "person_off" : "check_circle"}
                iconColor={userToToggle?.status === 'Active' ? "text-amber-500" : "text-emerald-500"}
                onClose={() => setUserToToggle(null)}
                onConfirm={confirmToggleStatus}
            />
        </div>
    );
};

export default UserManagement;
