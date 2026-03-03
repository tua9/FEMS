// ─── Reports / Performance Insights — mock data ──────────────────────────────

// ── Date range options ────────────────────────────────────────────────────────
export const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 Days',  days: 7  },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'All Time',     days: 0  },
] as const;

export type DateRangeDays = 7 | 30 | 90 | 0;

// ── KPI stat cards ────────────────────────────────────────────────────────────
export interface StatCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  fillIcon?: boolean;
  changeLabel: string;
  changeColor: string;
  value: string;
  label: string;
}

/** Returns stat cards adjusted for the selected date range */
export function getStatCards(days: DateRangeDays): StatCard[] {
  // Scale values slightly to simulate different time periods
  const scale = days === 7 ? 0.22 : days === 30 ? 1 : days === 90 ? 2.8 : 4.5;
  const maintenance = Math.round(342 * scale);
  const avgResponse = days === 7 ? '1.1h' : days === 30 ? '1.4h' : days === 90 ? '1.6h' : '1.8h';
  const resRate = days === 7 ? '97.2%' : days === 30 ? '94.8%' : days === 90 ? '93.1%' : '92.4%';
  const uptime = days === 7 ? '99.8%' : days === 30 ? '99.2%' : days === 90 ? '98.7%' : '98.1%';
  return [
    {
      icon: 'trending_up', iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      changeLabel: days === 7 ? '+6.1%' : days === 30 ? '+4.2%' : days === 90 ? '+2.9%' : '+1.8%',
      changeColor: 'text-emerald-500', value: resRate, label: 'Resolution Rate',
    },
    {
      icon: 'timer', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', fillIcon: true,
      changeLabel: days === 7 ? '-22m' : days === 30 ? '-12m' : days === 90 ? '-5m' : '+3m',
      changeColor: days === 0 ? 'text-rose-500' : 'text-emerald-500',
      value: avgResponse, label: 'Avg. Response Time',
    },
    {
      icon: 'check_circle', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', fillIcon: true,
      changeLabel: 'Stable', changeColor: 'text-slate-400', value: uptime, label: 'Asset Uptime',
    },
    {
      icon: 'construction', iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      changeLabel: days === 7 ? '+8%' : days === 30 ? '+12%' : days === 90 ? '+18%' : '+22%',
      changeColor: 'text-rose-500', value: `${maintenance}`, label: 'Total Maintenance',
    },
  ];
}

// Keep static export for backward compat
export const STAT_CARDS: StatCard[] = getStatCards(30);

// ── Ticket trend chart data ───────────────────────────────────────────────────
export interface TrendPoint { label: string; reported: number; resolved: number }

export function getTrendPoints(days: DateRangeDays): TrendPoint[] {
  if (days === 7) {
    return [
      { label: 'Mon', reported: 8,  resolved: 7  },
      { label: 'Tue', reported: 12, resolved: 10 },
      { label: 'Wed', reported: 9,  resolved: 9  },
      { label: 'Thu', reported: 15, resolved: 12 },
      { label: 'Fri', reported: 11, resolved: 10 },
      { label: 'Sat', reported: 4,  resolved: 4  },
      { label: 'Sun', reported: 2,  resolved: 2  },
    ];
  }
  if (days === 30) {
    return [
      { label: 'Oct 01', reported: 22, resolved: 18 },
      { label: 'Oct 08', reported: 35, resolved: 28 },
      { label: 'Oct 15', reported: 28, resolved: 25 },
      { label: 'Oct 22', reported: 42, resolved: 36 },
      { label: 'Oct 30', reported: 31, resolved: 28 },
    ];
  }
  if (days === 90) {
    return [
      { label: 'Aug', reported: 88,  resolved: 74  },
      { label: 'Sep', reported: 102, resolved: 89  },
      { label: 'Oct', reported: 115, resolved: 98  },
    ];
  }
  // All time
  return [
    { label: 'Q1', reported: 210, resolved: 185 },
    { label: 'Q2', reported: 268, resolved: 241 },
    { label: 'Q3', reported: 295, resolved: 262 },
    { label: 'Q4', reported: 342, resolved: 310 },
  ];
}

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

// Full leaderboard — all performers (used by leaderboard modal)
export const ALL_PERFORMERS_BASE: Omit<Performer, 'tickets' | 'resolveRate'>[] = [
  { rank: 1,  rankBg: 'bg-emerald-500', name: 'Marcus Thorne',  initials: 'MT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGFNwLU9EfhxGexiaMimmAb95aoYyejy0f0ZdHLub3EAjZ8EgpsK3xk_leqeHmzxqy1L5ImFtgOW72yD-vAi6yNMwNFFX6UgQPBfoJW_b5JcGoomzRcrCh_y2xtl4qrVk7hpZARPei5RgcCLZXxXjRKkL90LBJfGtAi2UYf7xbtW5vRq6-S6pIxWBjZiBvoqnpWKRUqG0iJkKbPEUALJzxLCw8-gC6saLMjkvCg8RFm-ZWEh8kU7z8fwC-HhTIO-Bv6Ihi99Qxf4M' },
  { rank: 2,  rankBg: 'bg-slate-400',   name: 'Sarah Jenkins',  initials: 'SJ' },
  { rank: 3,  rankBg: 'bg-amber-600',   name: 'David Lee',      initials: 'DL' },
  { rank: 4,  rankBg: 'bg-slate-300',   name: 'Elena Kovic',    initials: 'EK' },
  { rank: 5,  rankBg: 'bg-slate-300',   name: 'James Doe',      initials: 'JD' },
  { rank: 6,  rankBg: 'bg-slate-300',   name: 'Aiko Tanaka',    initials: 'AT' },
  { rank: 7,  rankBg: 'bg-slate-300',   name: 'Liam Carter',    initials: 'LC' },
  { rank: 8,  rankBg: 'bg-slate-300',   name: 'Nina Cruz',      initials: 'NC' },
  { rank: 9,  rankBg: 'bg-slate-300',   name: 'Tom Blake',      initials: 'TB' },
  { rank: 10, rankBg: 'bg-slate-300',   name: 'Grace Hall',     initials: 'GH' },
];

// Rate & ticket base (30-day baseline)
const PERFORMER_STATS: { resolveRate30: string; tickets30: number }[] = [
  { resolveRate30: '98%', tickets30: 142 },
  { resolveRate30: '95%', tickets30: 128 },
  { resolveRate30: '92%', tickets30: 115 },
  { resolveRate30: '90%', tickets30: 104 },
  { resolveRate30: '88%', tickets30: 96  },
  { resolveRate30: '86%', tickets30: 89  },
  { resolveRate30: '84%', tickets30: 81  },
  { resolveRate30: '82%', tickets30: 74  },
  { resolveRate30: '80%', tickets30: 68  },
  { resolveRate30: '78%', tickets30: 61  },
];

export function getAllPerformers(days: DateRangeDays): Performer[] {
  const scale = days === 7 ? 0.22 : days === 30 ? 1 : days === 90 ? 2.8 : 4.5;
  return ALL_PERFORMERS_BASE.map((base, i) => {
    const stat = PERFORMER_STATS[i];
    return {
      ...base,
      tickets: Math.round(stat.tickets30 * scale),
      resolveRate: `${stat.resolveRate30} Resolve Rate`,
    };
  });
}

export function getTopPerformers(days: DateRangeDays): Performer[] {
  return getAllPerformers(days).slice(0, 3);
}

export const TOP_PERFORMERS: Performer[] = getTopPerformers(30);

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

export function getFacilityRows(days: DateRangeDays): FacilityRow[] {
  // Operational % slightly changes per window to simulate live data
  const hvacOp   = days === 7 ? 98 : days === 30 ? 96 : days === 90 ? 94 : 91;
  const avOp     = days === 7 ? 92 : days === 30 ? 88 : days === 90 ? 85 : 82;
  const netOp    = days === 7 ? 100 : days === 30 ? 100 : days === 90 ? 99 : 98;
  return [
    {
      assetType: 'HVAC Systems', unitLabel: '32 Units',
      operationalPct: hvacOp, barColor: hvacOp >= 95 ? 'bg-emerald-500' : 'bg-amber-400',
      criticality: 'High', mtbf: days === 7 ? '4,380 hrs' : '4,200 hrs',
      trend: hvacOp >= 96 ? 'up' : 'flat',
    },
    {
      assetType: 'AV Equipment', unitLabel: '124 Devices',
      operationalPct: avOp, barColor: avOp >= 90 ? 'bg-emerald-500' : 'bg-blue-500',
      criticality: 'Medium', mtbf: '1,850 hrs',
      trend: days === 7 ? 'up' : days === 30 ? 'down' : 'down',
    },
    {
      assetType: 'Network Infrastructure', unitLabel: '18 Nodes',
      operationalPct: netOp, barColor: 'bg-emerald-500',
      criticality: 'Normal', mtbf: '12,400 hrs',
      trend: netOp === 100 ? 'flat' : 'down',
    },
  ];
}

export const FACILITY_ROWS: FacilityRow[] = getFacilityRows(30);

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
