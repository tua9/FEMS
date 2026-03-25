import type { DashboardMetrics, EquipmentRequest, DamageReport, HealthStatus, TopBrokenItem } from '@/types/admin.types';

export const mockDashboardMetrics: DashboardMetrics = {
    totalDevices: 64,
    devicesTrend: 8,
    brokenDevices: 4,
    criticalRepairs: 2,
    pendingRequests: 5,
    avgResponseTimeHours: 3.5,
    efficiencyRate: 98,
};

export const mockHealthStatus: HealthStatus = {
    healthy: 92,
    available: 58,
    maintenance: 2,
    broken: 4,
};

export const mockTopBrokenEquipment: TopBrokenItem[] = [
    { name: 'Projector Pro-X1', count: 12, percentage: 85 },
    { name: 'Workstation #42', count: 8, percentage: 60 },
    { name: 'Lab Microscopes', count: 7, percentage: 52 },
    { name: 'Network Switch', count: 5, percentage: 38 },
    { name: 'Oscilloscope Digital', count: 4, percentage: 30 },
];

export const mockInventoryRequests: EquipmentRequest[] = [
    {
        id: 'REQ-001',
        requesterId: 'STU-001',
        requesterName: 'Sarah J.',
        requesterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAyDpl-KPOcbkM73lfg-cJByguFPLaTMq-0bDAWLD1LRKU10ZVCc1p3UFwKPQ7JSIcd5McR1xcqkJ3jSezyfiov1HcbVuCm5W37NJsuvZMLU1s8bGeqdtkNyFvNWHxJzTwozLq4T57EwEtdkT-4vfn0eDrVhdniE2u3csPo7PG9d4kRc_eMf-c4MyFqL8camgdKKW0ThCygGOb1fIAg-UOavWhUHrYKrHwhsoz6KkwQePPGjDKifkgxUe6BONvkNly0OPxCv_adS4-',
        equipmentName: 'Apple iMac 27" 5K',
        department: 'Graphic Design',
        timeRequested: '2 hours ago',
        priority: 'Medium',
        status: 'Pending',
    },
    {
        id: 'REQ-002',
        requesterId: 'STU-002',
        requesterName: 'Marcus Lee',
        requesterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_CTZJ6TkI2kB_bmMvAY5IMrEnmjb9stu7ItOEL5JcXyaDFkLv-zwwaaBgcNvmWb3PQ5cy5ZAQ28KM3eNQevTfAmlo481mwOTJ_zp0FeMbufbH4wjHANP6psTBejCjZgv7eBCQ_EIl3GqfxJ7QFK0VK2ghJb_XBKUJrRkUl6k0Kbw0BXSxCa1NZB0i8LrUDPD_shas-75hpwAj-lAhd-2vdv1taxwpA778NKxHa5qntOVKuZS_H4LvBr2nCWYo8hkCYDVkje02Tyc_',
        equipmentName: 'Cisco Router ISR 4000',
        department: 'IT Engineering',
        timeRequested: '5 hours ago',
        priority: 'Low',
        status: 'Pending',
    },
    {
        id: 'REQ-003',
        requesterId: 'STU-003',
        requesterName: 'Elena Vance',
        requesterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVzPO2HAOwSBaDgWwiCuz2pDt2XR6MarE9abgyU6ahphmtLTzWLPfG-kAqrnlKha30BKkIktXNy3aDbbK9fZRftRg2-TxViirAHozHCS8n-IznB1wV-Li83fXwycgZoGXmcNidRzoKwejA9vZ_y57SW-RhhKyfcdrbXmNRWo4Jgn2xgRWUa9_2mdZiQmyaxl8WjZE3WnSpUO-8IOBLlZB-Gcz_RLgihfXgygKTStPjF0qL429ylTsH9PoFLaHYrFmCOgOYt4zbMxn9',
        equipmentName: '3D Printer MakerBot',
        department: 'Mechanical Lab',
        timeRequested: 'Yesterday',
        priority: 'High',
        status: 'Pending',
    },
];

export const mockRecentDamageReports: DamageReport[] = [
    {
        id: 'REP-001',
        equipmentId: 'ASSET-1029',
        equipmentName: 'Projector Pro-X1 (Auditorium A)',
        issueDescription: 'Lens cracked, flickering display intermittently during presentations.',
        reportedBy: 'Dr. Sarah J.',
        reporterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAyDpl-KPOcbkM73lfg-cJByguFPLaTMq-0bDAWLD1LRKU10ZVCc1p3UFwKPQ7JSIcd5McR1xcqkJ3jSezyfiov1HcbVuCm5W37NJsuvZMLU1s8bGeqdtkNyFvNWHxJzTwozLq4T57EwEtdkT-4vfn0eDrVhdniE2u3csPo7PG9d4kRc_eMf-c4MyFqL8camgdKKW0ThCygGOb1fIAg-UOavWhUHrYKrHwhsoz6KkwQePPGjDKifkgxUe6BONvkNly0OPxCv_adS4-',
        dateReported: 'Oct 25, 2024',
        priority: 'High Priority',
        status: 'Pending',
    },
    {
        id: 'REP-002',
        equipmentId: 'ASSET-42',
        equipmentName: 'Dell Workstation #42',
        issueDescription: "System won't boot past BIOS, recurring blue screen of death errors.",
        reportedBy: 'Marcus Lee',
        reporterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_CTZJ6TkI2kB_bmMvAY5IMrEnmjb9stu7ItOEL5JcXyaDFkLv-zwwaaBgcNvmWb3PQ5cy5ZAQ28KM3eNQevTfAmlo481mwOTJ_zp0FeMbufbH4wjHANP6psTBejCjZgv7eBCQ_EIl3GqfxJ7QFK0VK2ghJb_XBKUJrRkUl6k0Kbw0BXSxCa1NZB0i8LrUDPD_shas-75hpwAj-lAhd-2vdv1taxwpA778NKxHa5qntOVKuZS_H4LvBr2nCWYo8hkCYDVkje02Tyc_',
        dateReported: 'Oct 24, 2024',
        priority: 'Medium Priority',
        status: 'In Progress',
    },
    {
        id: 'REP-003',
        equipmentId: 'ASSET-OVEN-01',
        equipmentName: 'Laboratory Oven 300C',
        issueDescription: 'Temperature sensor inaccurate by +/- 15 degrees, needs recalibration.',
        reportedBy: 'Elena Vance',
        reporterAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVzPO2HAOwSBaDgWwiCuz2pDt2XR6MarE9abgyU6ahphmtLTzWLPfG-kAqrnlKha30BKkIktXNy3aDbbK9fZRftRg2-TxViirAHozHCS8n-IznB1wV-Li83fXwycgZoGXmcNidRzoKwejA9vZ_y57SW-RhhKyfcdrbXmNRWo4Jgn2xgRWUa9_2mdZiQmyaxl8WjZE3WnSpUO-8IOBLlZB-Gcz_RLgihfXgygKTStPjF0qL429ylTsH9PoFLaHYrFmCOgOYt4zbMxn9',
        dateReported: 'Oct 23, 2024',
        priority: 'Low Priority',
        status: 'Pending',
    },
];
