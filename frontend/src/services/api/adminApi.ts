import { mockDashboardMetrics, mockInventoryRequests, mockRecentDamageReports, mockTopBrokenEquipment, mockHealthStatus } from '../../data/admin/mockAdminDashboard';
import { mockEquipmentList, mockBrokenEquipmentAttention } from '../../data/admin/mockAdminEquipment';
import { mockUsersList } from '../../data/admin/mockAdminUsers';
import { mockBorrowingList } from '../../data/admin/mockAdminBorrowing';
import { mockDamageReportsList } from '../../data/admin/mockAdminReports';

import { User, Asset, BorrowRecord } from '../../types/admin.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminApi = {
    // Dashboard
    getDashboardMetrics: async () => {
        await delay(500);
        return mockDashboardMetrics;
    },
    getHealthStatus: async () => {
        await delay(300);
        return mockHealthStatus;
    },
    getTopBrokenEquipment: async () => {
        await delay(400);
        return mockTopBrokenEquipment;
    },
    getInventoryRequests: async () => {
        await delay(600);
        return mockInventoryRequests;
    },
    getRecentDamageReports: async () => {
        await delay(450);
        return mockRecentDamageReports;
    },

    // Equipment
    getEquipmentList: async () => {
        await delay(600);
        return mockEquipmentList;
    },
    getBrokenEquipmentAttention: async () => {
        await delay(400);
        return mockBrokenEquipmentAttention;
    },
    updateEquipment: async (equipment: Asset) => {
        await delay(800);
        const index = mockEquipmentList.findIndex(e => e.id === equipment.id);
        if (index > -1) {
            mockEquipmentList[index] = { ...equipment };
            return { success: true, equipment: mockEquipmentList[index] };
        }
        // Fallback: if not found, it might be a new one we're "updating" (persisting)
        mockEquipmentList.unshift(equipment);
        return { success: true, equipment };
    },
    createEquipment: async (equipment: Asset) => {
        await delay(800);
        mockEquipmentList.unshift(equipment);
        return { success: true, equipment };
    },

    // Users
    getUsersList: async () => {
        await delay(500);
        return mockUsersList;
    },
    resetPassword: async (userId: string) => {
        await delay(800);
        return { success: true, message: `Password reset instructions sent to user ${userId}` };
    },
    updateUserStatus: async (userId: string, status: string) => {
        await delay(600);
        const userIndex = mockUsersList.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            mockUsersList[userIndex] = { ...mockUsersList[userIndex], status: status as any };
            return { success: true, newStatus: status };
        }
        throw new Error("User not found");
    },
    updateUser: async (user: User) => {
        await delay(800);
        const userIndex = mockUsersList.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
            mockUsersList[userIndex] = { ...user };
            return { success: true, user: mockUsersList[userIndex] };
        }
        throw new Error("User not found");
    },

    // Borrowing
    getBorrowingList: async () => {
        await delay(500);
        return mockBorrowingList;
    },
    updateBorrowStatus: async (recordId: string, status: BorrowRecord['status']) => {
        await delay(600);
        const index = mockBorrowingList.findIndex(r => r.id === recordId);
        if (index > -1) {
            mockBorrowingList[index] = { ...mockBorrowingList[index], status };
            return { success: true, record: mockBorrowingList[index] };
        }
        throw new Error("Record not found");
    },
    sendBorrowAlert: async (recordId: string) => {
        await delay(800);
        return { success: true, message: `Alert sent for record ${recordId}` };
    },

    // Reports
    getDamageReports: async () => {
        await delay(500);
        return mockDamageReportsList;
    }
};
