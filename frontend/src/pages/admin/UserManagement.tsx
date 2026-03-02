import React, { useEffect, useState } from 'react';
import UserTable from '../../components/admin/users/UserTable';
import AddUserModal from '../../components/admin/users/AddUserModal';
import { adminApi } from '../../services/api/adminApi';
import { User } from '../../types/admin.types';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersData = await adminApi.getUsersList();
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const activeUsers = users.filter(u => u.status === 'Active').length;
    const lockedUsers = users.filter(u => u.status === 'Locked').length;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isAddModalOpen ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">System Users</h2>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">Manage staff, students and administrative accounts.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-slate-200 rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <span className="material-symbols-outlined text-lg">group</span>
                            Bulk Import
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
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
                            <p className="text-[10px] font-bold uppercase text-red-500 mb-1">Locked</p>
                            <h3 className="text-2xl font-extrabold text-red-600 dark:text-red-400">{lockedUsers}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">lock</span>
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
                                    placeholder="Search user by name or email..."
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                Role: All <span className="material-symbols-outlined text-sm ml-2">expand_more</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                <span className="material-symbols-outlined text-lg">filter_list</span>
                            </button>
                        </div>
                    </div>

                    <UserTable users={users} />
                </div>
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default UserManagement;
