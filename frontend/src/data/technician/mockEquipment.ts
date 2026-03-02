// ─── Equipment data for the Asset Inventory page ────────────────────────────

export type AssetCategory = 'All Assets' | 'Computing' | 'AV Display' | 'Networking' | 'Peripherals' | 'Other';
export type AssetStatus   = 'Operational' | 'Maintenance' | 'Faulty' | 'Offline';

export interface Asset {
  id: string;
  serial: string;
  name: string;
  category: Exclude<AssetCategory, 'All Assets'>;
  icon: string;
  status: AssetStatus;
  location?: string;
  purchaseDate?: string;
  condition?: number;       // 0-100
  notes?: string;
  imageUrl?: string;        // base64 or object URL for uploaded image
}

// ─── Category metadata ───────────────────────────────────────────────────────
export interface CategoryMeta {
  label: AssetCategory;
  icon: string;
  count: number;
}

export const CATEGORY_META: CategoryMeta[] = [
  { label: 'All Assets',  icon: 'grid_view',    count: 128 },
  { label: 'Computing',   icon: 'laptop_mac',   count: 42  },
  { label: 'AV Display',  icon: 'monitor',      count: 28  },
  { label: 'Networking',  icon: 'router',       count: 15  },
  { label: 'Peripherals', icon: 'print',        count: 12  },
  { label: 'Other',       icon: 'category',     count: 5   },
];

// ─── Mock assets ─────────────────────────────────────────────────────────────
export const MOCK_ASSETS: Asset[] = [
  { id: 'A-001', serial: 'FPT-LAP-082', name: 'MacBook Pro M2',        category: 'Computing',   icon: 'laptop_mac',      status: 'Operational', location: 'Room 201 – FPT Tower A', purchaseDate: '2023-03-15', condition: 95, notes: 'Primary dev workstation for Lab 2A.' },
  { id: 'A-002', serial: 'FPT-MN-033',  name: 'UltraWide 34" Monitor', category: 'AV Display',  icon: 'monitor',         status: 'Operational', location: 'Room 305 – FPT Tower B', purchaseDate: '2022-11-20', condition: 88, notes: 'Dual-input display for presentation bay.' },
  { id: 'A-003', serial: 'FPT-PJ-014',  name: '4K Laser Projector',    category: 'AV Display',  icon: 'videocam',        status: 'Maintenance', location: 'Auditorium A',           purchaseDate: '2021-07-08', condition: 62, notes: 'Lamp replacement scheduled for next sprint.' },
  { id: 'A-004', serial: 'FPT-TAB-055', name: 'iPad Air 5th Gen',      category: 'Computing',   icon: 'tablet_mac',      status: 'Operational', location: 'IT Dept – Storage B',    purchaseDate: '2023-09-01', condition: 99, notes: 'Loan device; issued to staff on request.' },
  { id: 'A-005', serial: 'FPT-PC-014',  name: 'Dell Precision Tower',  category: 'Computing',   icon: 'desktop_windows', status: 'Faulty',      location: 'Repair Bay – Level 1',  purchaseDate: '2020-04-12', condition: 35, notes: 'GPU failure reported. Awaiting spare parts.' },
  { id: 'A-006', serial: 'FPT-PR-002',  name: 'HP LaserJet Enterprise',category: 'Peripherals', icon: 'print',           status: 'Operational', location: 'Office Floor 3',        purchaseDate: '2022-06-30', condition: 80, notes: 'Monthly cartridge check required.' },
  { id: 'A-007', serial: 'FPT-LAP-091', name: 'ThinkPad X1 Carbon',   category: 'Computing',   icon: 'laptop_mac',      status: 'Operational', location: 'Room 202 – FPT Tower A', purchaseDate: '2023-01-10', condition: 92, notes: '' },
  { id: 'A-008', serial: 'FPT-MN-041',  name: 'Samsung 27" Curved',   category: 'AV Display',  icon: 'monitor',         status: 'Maintenance', location: 'Conference Room C2',    purchaseDate: '2021-12-05', condition: 70, notes: 'Backlight flickering at lower brightness.' },
  { id: 'A-009', serial: 'FPT-RO-007',  name: 'Cisco Catalyst 2960',  category: 'Networking',  icon: 'router',          status: 'Operational', location: 'Server Room – B1',      purchaseDate: '2019-08-22', condition: 78, notes: 'Core switch for VLAN segmentation.' },
  { id: 'A-010', serial: 'FPT-RO-012',  name: 'Ubiquiti UniFi AP',    category: 'Networking',  icon: 'wifi_tethering',  status: 'Operational', location: 'Corridor Level 2',      purchaseDate: '2022-03-14', condition: 90, notes: '' },
  { id: 'A-011', serial: 'FPT-PR-008',  name: 'Logitech MX Keys',     category: 'Peripherals', icon: 'keyboard',        status: 'Operational', location: 'Hot-Desk Pool',         purchaseDate: '2023-05-18', condition: 97, notes: '' },
  { id: 'A-012', serial: 'FPT-PC-022',  name: 'HP EliteDesk 800',     category: 'Computing',   icon: 'desktop_windows', status: 'Operational', location: 'Room 106 – FPT Tower A', purchaseDate: '2021-10-09', condition: 83, notes: '' },
  { id: 'A-013', serial: 'FPT-PJ-019',  name: 'BenQ TK850 Projector', category: 'AV Display',  icon: 'videocam',        status: 'Faulty',      location: 'Repair Bay – Level 1',  purchaseDate: '2020-09-17', condition: 28, notes: 'HDMI port damaged. Cannot display signal.' },
  { id: 'A-014', serial: 'FPT-RO-018',  name: 'TP-Link TL-SG1024',   category: 'Networking',  icon: 'router',          status: 'Offline',     location: 'Server Room – B1',      purchaseDate: '2018-06-01', condition: 15, notes: 'EOL device. Pending decommission approval.' },
  { id: 'A-015', serial: 'FPT-LAP-103', name: 'Dell XPS 15',          category: 'Computing',   icon: 'laptop_mac',      status: 'Operational', location: 'Room 305 – FPT Tower B', purchaseDate: '2023-07-21', condition: 96, notes: '' },
  { id: 'A-016', serial: 'FPT-PR-015',  name: 'Epson WorkForce Pro',  category: 'Peripherals', icon: 'print',           status: 'Maintenance', location: 'Office Floor 4',        purchaseDate: '2022-02-28', condition: 55, notes: 'Paper feed jamming intermittently.' },
  { id: 'A-017', serial: 'FPT-MN-055',  name: 'LG 32" 4K Display',   category: 'AV Display',  icon: 'tv',              status: 'Operational', location: 'Board Room 1',          purchaseDate: '2023-04-03', condition: 94, notes: '' },
  { id: 'A-018', serial: 'FPT-RO-024',  name: 'Netgear GS316',           category: 'Networking',  icon: 'router',          status: 'Operational', location: 'Server Room – B2',       purchaseDate: '2022-08-16', condition: 87, notes: '' },
  { id: 'A-019', serial: 'FPT-OT-001',  name: 'Smart Whiteboard',         category: 'Other',       icon: 'category',        status: 'Operational', location: 'Conference Room A',      purchaseDate: '2023-02-10', condition: 91, notes: 'Interactive digital whiteboard, touch-enabled.' },
  { id: 'A-020', serial: 'FPT-OT-002',  name: 'Label Printer',            category: 'Other',       icon: 'category',        status: 'Operational', location: 'IT Dept – Storage A',    purchaseDate: '2022-07-14', condition: 85, notes: 'Used for asset tagging and barcode printing.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAssetsByCategory(category: AssetCategory): Asset[] {
  if (category === 'All Assets') return MOCK_ASSETS;
  return MOCK_ASSETS.filter((a) => a.category === category);
}

export interface StatusStyle { label: string; color: string; dot: string; bg: string; border: string }

export function getAssetStatusStyle(status: AssetStatus): StatusStyle {
  const map: Record<AssetStatus, StatusStyle> = {
    Operational: { label: 'Operational', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
    Maintenance: { label: 'Maintenance', color: 'text-amber-600',   dot: 'bg-amber-500',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
    Faulty:      { label: 'Faulty',      color: 'text-rose-600',    dot: 'bg-rose-500',    bg: 'bg-rose-50',     border: 'border-rose-200'    },
    Offline:     { label: 'Offline',     color: 'text-slate-500',   dot: 'bg-slate-400',   bg: 'bg-slate-100',   border: 'border-slate-200'   },
  };
  return map[status];
}
