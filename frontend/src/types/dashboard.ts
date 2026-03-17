export interface LecturerStats {
    equipmentBorrowed: number;
    pendingRequests: number;
    reportsSent: number;
    assignedRooms: number;
}

export type ActivityType = 'access' | 'return' | 'report';

export interface RecentActivity {
    id: string;
    type: ActivityType;
    title: string;
    subject: string;
    time: string; // From backend (ISO or relative)
    description?: string;
}

export interface UsageStatsData {
    barData: Array<{ name: string; current: number; average: number }>;
    pieData: Array<{ name: string; value: number; color: string }>;
    totalItems: number;
    peakSubject: { name: string; increase: string };
    availability: { rate: number; status: string };
}
