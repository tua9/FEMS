/**
 * mockTechnicianData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dữ liệu giả dành riêng cho Technician role.
 * Re-export + enrich từ mockDatabase; giữ nguyên các mock file cũ để không
 * phá vỡ các page đang import trực tiếp từ chúng.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  MOCK_REPORTS,
  MOCK_EQUIPMENT,
  MOCK_ROOMS,
  MOCK_USERS,
  MOCK_BUILDINGS,
  populateReport,
  populateEquipment,
} from '@/data/mockDatabase';

// ─── Re-export populated collections ─────────────────────────────────────────

export const ALL_REPORTS_POPULATED   = MOCK_REPORTS.map(populateReport);
export const ALL_EQUIPMENT_POPULATED = MOCK_EQUIPMENT.map(populateEquipment);

// ─── Dashboard KPI summary (derive from mock data) ───────────────────────────

export interface TechnicianKPI {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  changeLabel: string;
  changeColor: string;
}

export const TECHNICIAN_KPI: TechnicianKPI[] = [
  {
    label: 'Open Tickets',
    value: String(MOCK_REPORTS.filter(r => r.status === 'pending').length),
    icon: 'assignment',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    changeLabel: '+2 today',
    changeColor: 'text-rose-500',
  },
  {
    label: 'Resolved Today',
    value: String(MOCK_REPORTS.filter(r => r.status === 'approved').length),
    icon: 'check_circle',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    changeLabel: 'Stable',
    changeColor: 'text-slate-400',
  },
  {
    label: 'Equipment Faults',
    value: String(MOCK_EQUIPMENT.filter(e => e.status === 'broken' || e.status === 'maintenance').length),
    icon: 'build',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    changeLabel: '-1 this week',
    changeColor: 'text-emerald-500',
  },
  {
    label: 'Available Rooms',
    value: String(MOCK_ROOMS.filter(r => r.status === 'available').length),
    icon: 'meeting_room',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    changeLabel: 'Normal',
    changeColor: 'text-slate-400',
  },
];

// ─── Equipment summary for technician dashboard ───────────────────────────────

export interface TechEquipmentSummary {
  id: string;
  name: string;
  qrCode: string;
  status: string;
  room: string;
  building: string;
  category: string;
}

export const TECH_EQUIPMENT_SUMMARY: TechEquipmentSummary[] = MOCK_EQUIPMENT.map(eq => {
  const room     = MOCK_ROOMS.find(r => r._id === eq.room_id);
  const building = MOCK_BUILDINGS.find(b => b._id === room?.building_id);
  return {
    id: eq._id,
    name: eq.name,
    qrCode: eq.qr_code ?? eq._id,
    status: eq.status,
    room: room?.name ?? 'Unassigned',
    building: building?.name ?? '—',
    category: eq.category,
  };
});

// ─── Report summary for technician dashboard ─────────────────────────────────

export interface TechReportSummary {
  id: string;
  description: string;
  type: string;
  status: string;
  reporterName: string;
  roomName: string;
  equipmentName: string;
  createdAt: string;
}

export const TECH_REPORT_SUMMARY: TechReportSummary[] = MOCK_REPORTS.map(rep => {
  const user  = MOCK_USERS.find(u => u._id === rep.user_id);
  const room  = MOCK_ROOMS.find(r => r._id === rep.room_id);
  const equip = MOCK_EQUIPMENT.find(e => e._id === rep.equipment_id);
  return {
    id: rep._id,
    description: rep.description ?? '—',
    type: rep.type,
    status: rep.status,
    reporterName: user?.displayName ?? 'Guest',
    roomName: room?.name ?? '—',
    equipmentName: equip?.name ?? '—',
    createdAt: rep.createdAt,
  };
});

// ─── Building & Room health overview ─────────────────────────────────────────

export interface BuildingHealth {
  buildingId: string;
  buildingName: string;
  totalRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  equipmentCount: number;
  faultyEquipment: number;
}

export const BUILDING_HEALTH: BuildingHealth[] = MOCK_BUILDINGS.map(b => {
  const rooms  = MOCK_ROOMS.filter(r => r.building_id === b._id);
  const roomIds = rooms.map(r => r._id);
  const equips = MOCK_EQUIPMENT.filter(e => roomIds.includes(e.room_id ?? ''));
  return {
    buildingId: b._id,
    buildingName: b.name,
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'available').length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    equipmentCount: equips.length,
    faultyEquipment: equips.filter(e => e.status === 'broken' || e.status === 'maintenance').length,
  };
});
