import { mockDashboardMetrics, mockInventoryRequests, mockRecentDamageReports, mockTopBrokenEquipment, mockHealthStatus } from '../../data/admin/mockAdminDashboard';
import { mockEquipmentList, mockBrokenEquipmentAttention } from '../../data/admin/mockAdminEquipment';
import { mockUsersList } from '../../data/admin/mockAdminUsers';
import { mockBorrowingList } from '../../data/admin/mockAdminBorrowing';
import { mockDamageReportsList } from '../../data/admin/mockAdminReports';

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

    // Users
    getUsersList: async () => {
        await delay(500);
        return mockUsersList;
    },

    // Borrowing
    getBorrowingList: async () => {
        await delay(500);
        return mockBorrowingList;
    },

    // Reports
    getDamageReports: async () => {
        await delay(500);
        return mockDamageReportsList;
    }
};
