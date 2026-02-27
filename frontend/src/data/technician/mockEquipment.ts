// ─── Equipment data for the Asset Inventory page ────────────────────────────

export type AssetCategory = 'All Assets' | 'Computing' | 'AV Display' | 'Networking' | 'Peripherals';
export type AssetStatus   = 'Operational' | 'Maintenance' | 'Faulty' | 'Offline';

export interface Asset {
  id: string;
  serial: string;         // e.g. FPT-LAP-082
  name: string;
  category: Exclude<AssetCategory, 'All Assets'>;
  icon: string;           // material-symbols icon name
  status: AssetStatus;
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
];

// ─── Mock assets (6 per "page" by default) ───────────────────────────────────
export const MOCK_ASSETS: Asset[] = [
  { id: 'A-001', serial: 'FPT-LAP-082', name: 'MacBook Pro M2',        category: 'Computing',   icon: 'laptop_mac',      status: 'Operational' },
  { id: 'A-002', serial: 'FPT-MN-033',  name: 'UltraWide 34" Monitor', category: 'AV Display',  icon: 'monitor',         status: 'Operational' },
  { id: 'A-003', serial: 'FPT-PJ-014',  name: '4K Laser Projector',    category: 'AV Display',  icon: 'videocam',        status: 'Maintenance' },
  { id: 'A-004', serial: 'FPT-TAB-055', name: 'iPad Air 5th Gen',      category: 'Computing',   icon: 'tablet_mac',      status: 'Operational' },
  { id: 'A-005', serial: 'FPT-PC-014',  name: 'Dell Precision Tower',  category: 'Computing',   icon: 'desktop_windows', status: 'Faulty'      },
  { id: 'A-006', serial: 'FPT-PR-002',  name: 'HP LaserJet Enterprise',category: 'Peripherals', icon: 'print',           status: 'Operational' },
  { id: 'A-007', serial: 'FPT-LAP-091', name: 'ThinkPad X1 Carbon',   category: 'Computing',   icon: 'laptop_mac',      status: 'Operational' },
  { id: 'A-008', serial: 'FPT-MN-041',  name: 'Samsung 27" Curved',   category: 'AV Display',  icon: 'monitor',         status: 'Maintenance' },
  { id: 'A-009', serial: 'FPT-RO-007',  name: 'Cisco Catalyst 2960',  category: 'Networking',  icon: 'router',          status: 'Operational' },
  { id: 'A-010', serial: 'FPT-RO-012',  name: 'Ubiquiti UniFi AP',    category: 'Networking',  icon: 'wifi_tethering',  status: 'Operational' },
  { id: 'A-011', serial: 'FPT-PR-008',  name: 'Logitech MX Keys',     category: 'Peripherals', icon: 'keyboard',        status: 'Operational' },
  { id: 'A-012', serial: 'FPT-PC-022',  name: 'HP EliteDesk 800',     category: 'Computing',   icon: 'desktop_windows', status: 'Operational' },
  { id: 'A-013', serial: 'FPT-PJ-019',  name: 'BenQ TK850 Projector', category: 'AV Display',  icon: 'videocam',        status: 'Faulty'      },
  { id: 'A-014', serial: 'FPT-RO-018',  name: 'TP-Link TL-SG1024',   category: 'Networking',  icon: 'router',          status: 'Offline'     },
  { id: 'A-015', serial: 'FPT-LAP-103', name: 'Dell XPS 15',          category: 'Computing',   icon: 'laptop_mac',      status: 'Operational' },
  { id: 'A-016', serial: 'FPT-PR-015',  name: 'Epson WorkForce Pro',  category: 'Peripherals', icon: 'print',           status: 'Maintenance' },
  { id: 'A-017', serial: 'FPT-MN-055',  name: 'LG 32" 4K Display',   category: 'AV Display',  icon: 'tv',              status: 'Operational' },
  { id: 'A-018', serial: 'FPT-RO-024',  name: 'Netgear GS316',        category: 'Networking',  icon: 'router',          status: 'Operational' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAssetsByCategory(category: AssetCategory): Asset[] {
  if (category === 'All Assets') return MOCK_ASSETS;
  return MOCK_ASSETS.filter((a) => a.category === category);
}

export interface StatusStyle { label: string; color: string; dot: string }

export function getAssetStatusStyle(status: AssetStatus): StatusStyle {
  const map: Record<AssetStatus, StatusStyle> = {
    Operational: { label: 'Operational', color: 'text-emerald-500', dot: 'bg-emerald-500' },
    Maintenance: { label: 'Maintenance', color: 'text-amber-500',   dot: 'bg-amber-500'   },
    Faulty:      { label: 'Faulty',      color: 'text-rose-500',    dot: 'bg-rose-500'    },
    Offline:     { label: 'Offline',     color: 'text-slate-400',   dot: 'bg-slate-400'   },
  };
  return map[status];
}
