import React, { useEffect, useState } from 'react';
import UserTable from '../../components/admin/users/UserTable';
import AddUserModal from '../../components/admin/users/AddUserModal';
import UserDetailModal from '../../components/admin/users/UserDetailModal';
import DeleteConfirmationModal from '../../components/admin/common/DeleteConfirmationModal';
import { adminApi } from '../../services/api/adminApi';
import { User } from '../../types/admin.types';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [isExporting, setIsExporting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchUserData = React.useCallback(async () => {
        try {
            const usersData = await adminApi.getUsersList();
            setUsers([...usersData]); // Force new reference for re-calculation
        } catch (error) {
            console.error("Failed to fetch user data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleOpenDetails = (user: User) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        handleOpenDetails(user);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const activeUsers = users.filter(u => u.status === 'Active').length;
    const inactiveUsers = users.filter(u => u.status === 'Inactive').length;

    const isBlurred = isAddModalOpen || isDetailModalOpen || !!userToDelete;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">System Users</h2>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">Manage staff, students and administrative accounts.</p>
                    </div>
                    <div className="flex items-center gap-3">
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
                            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">{isExporting ? 'hourglass_top' : 'download'}</span>
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button
                            onClick={() => { setSelectedUser(null); setIsAddModalOpen(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10"
                        >
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Add User
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card dark:!bg-slate-800/80 p-5 ambient-shadow rounded-2xl border border-white/40 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Total Users</p>
                            <h3 className="text-2xl font-extrabold text-[#1A2B56] dark:text-white">{users.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                            <span className="material-symbols-outlined">manage_accounts</span>
                        </div>
                    </div>
                    <div className="glass-card dark:!bg-slate-800/80 p-5 ambient-shadow rounded-2xl border border-white/40 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Active</p>
                            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeUsers}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <div className="glass-card dark:!bg-slate-800/80 p-5 ambient-shadow rounded-2xl border border-white/40 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Technicians</p>
                            <h3 className="text-2xl font-extrabold text-[#1A2B56] dark:text-white">
                                {users.filter(u => u.role === 'Technician').length}
                            </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined">engineering</span>
                        </div>
                    </div>
                    <div className="glass-card dark:!bg-slate-800/80 p-5 ambient-shadow rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-red-500 mb-1">Inactive</p>
                            <h3 className="text-2xl font-extrabold text-red-600 dark:text-red-400">{inactiveUsers}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">person_off</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="relative max-w-sm w-full bg-white/60 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 p-0.5">
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-2xl text-sm font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                    placeholder="Search user by name, email or ID..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                    className="appearance-none flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all pr-10 outline-none cursor-pointer"
                                >
                                    <option value="All">Role: All</option>
                                    <option value="Student">Student</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                                <span className="material-symbols-outlined text-sm absolute right-3 top-2.5 pointer-events-none text-slate-400">expand_more</span>
                            </div>
                            <button
                                onClick={() => { setSearchQuery(''); setRoleFilter('All'); }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                            </button>
                        </div>
                    </div>

                    <UserTable
                        users={filteredUsers}
                        onOpenDetails={handleOpenDetails}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                user={selectedUser}
                onUserUpdated={fetchUserData}
            />

            <UserDetailModal
                isOpen={isDetailModalOpen}
                user={selectedUser}
                onClose={() => setIsDetailModalOpen(false)}
                onEdit={(user) => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(user);
                    setIsAddModalOpen(true);
                }}
                onUpdate={fetchUserData}
            />

            <DeleteConfirmationModal
                isOpen={!!userToDelete}
                title="Remove User Account"
                message="Are you sure you want to remove this user from the system? This action cannot be undone."
                itemName={userToDelete?.name}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default UserManagement;
