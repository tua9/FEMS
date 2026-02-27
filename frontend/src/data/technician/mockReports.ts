// ─── Reports / Performance Insights — mock data ──────────────────────────────

// ── KPI stat cards ────────────────────────────────────────────────────────────
export interface StatCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  fillIcon?: boolean;   // true → render with FILL=1 (material-symbols filled variant)
  changeLabel: string;
  changeColor: string;
  value: string;
  label: string;
}

export const STAT_CARDS: StatCard[] = [
  {
    icon: 'trending_up',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    changeLabel: '+4.2%',
    changeColor: 'text-emerald-500',
    value: '94.8%',
    label: 'Resolution Rate',
  },
  {
    icon: 'timer',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    fillIcon: true,
    changeLabel: '-12m',
    changeColor: 'text-emerald-500',
    value: '1.4h',
    label: 'Avg. Response Time',
  },
  {
    icon: 'check_circle',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    fillIcon: true,
    changeLabel: 'Stable',
    changeColor: 'text-slate-400',
    value: '99.2%',
    label: 'Asset Uptime',
  },
  {
    icon: 'construction',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    changeLabel: '+12%',
    changeColor: 'text-rose-500',
    value: '342',
    label: 'Total Maintenance',
  },
];

// ── Top performers ────────────────────────────────────────────────────────────
export interface Performer {
  rank: number;
  rankBg: string;
  name: string;
  resolveRate: string;
  tickets: number;
  initials: string;
  avatar?: string;
}

export const TOP_PERFORMERS: Performer[] = [
  {
    rank: 1,
    rankBg: 'bg-emerald-500',
    name: 'Marcus Thorne',
    resolveRate: '98% Resolve Rate',
    tickets: 142,
    initials: 'MT',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGFNwLU9EfhxGexiaMimmAb95aoYyejy0f0ZdHLub3EAjZ8EgpsK3xk_leqeHmzxqy1L5ImFtgOW72yD-vAi6yNMwNFFX6UgQPBfoJW_b5JcGoomzRcrCh_y2xtl4qrVk7hpZARPei5RgcCLZXxXjRKkL90LBJfGtAi2UYf7xbtW5vRq6-S6pIxWBjZiBvoqnpWKRUqG0iJkKbPEUALJzxLCw8-gC6saLMjkvCg8RFm-ZWEh8kU7z8fwC-HhTIO-Bv6Ihi99Qxf4M',
  },
  {
    rank: 2,
    rankBg: 'bg-slate-400',
    name: 'Sarah Jenkins',
    resolveRate: '95% Resolve Rate',
    tickets: 128,
    initials: 'SJ',
  },
  {
    rank: 3,
    rankBg: 'bg-amber-600',
    name: 'David Lee',
    resolveRate: '92% Resolve Rate',
    tickets: 115,
    initials: 'DL',
  },
];

// ── Facility health rows ──────────────────────────────────────────────────────
export type Criticality = 'High' | 'Medium' | 'Normal';
export type TrendDirection = 'up' | 'down' | 'flat';

export interface FacilityRow {
  assetType: string;
  unitLabel: string;
  operationalPct: number;
  barColor: string;
  criticality: Criticality;
  mtbf: string;
  trend: TrendDirection;
}

export const FACILITY_ROWS: FacilityRow[] = [
  {
    assetType: 'HVAC Systems',
    unitLabel: '32 Units',
    operationalPct: 96,
    barColor: 'bg-emerald-500',
    criticality: 'High',
    mtbf: '4,200 hrs',
    trend: 'up',
  },
  {
    assetType: 'AV Equipment',
    unitLabel: '124 Devices',
    operationalPct: 88,
    barColor: 'bg-blue-500',
    criticality: 'Medium',
    mtbf: '1,850 hrs',
    trend: 'down',
  },
  {
    assetType: 'Network Infrastructure',
    unitLabel: '18 Nodes',
    operationalPct: 100,
    barColor: 'bg-emerald-500',
    criticality: 'Normal',
    mtbf: '12,400 hrs',
    trend: 'flat',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getCriticalityStyle(c: Criticality) {
  const map: Record<Criticality, { pill: string; text: string }> = {
    High:   { pill: 'bg-rose-50 text-rose-600',   text: 'HIGH'   },
    Medium: { pill: 'bg-amber-50 text-amber-600', text: 'MEDIUM' },
    Normal: { pill: 'bg-blue-50 text-blue-600',   text: 'NORMAL' },
  };
  return map[c];
}

export function getTrendIcon(t: TrendDirection) {
  const map: Record<TrendDirection, { icon: string; color: string }> = {
    up:   { icon: 'trending_up',   color: 'text-emerald-500' },
    down: { icon: 'trending_down', color: 'text-rose-500'    },
    flat: { icon: 'trending_flat', color: 'text-slate-300'   },
  };
  return map[t];
}
