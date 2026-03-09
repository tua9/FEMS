// ─── Shared Navbar — Type definitions ─────────────────────────────────────────
// Dùng chung cho tất cả role: admin | lecturer | student | technician

export interface NavLinkItem {
  name: string;
  path: string;
}

export interface NavbarProps {
  /** Label hiển thị bên dưới F-EMS, e.g. "STUDENT PORTAL" */
  portalLabel: string;
  /** Danh sách nav links của role */
  links: NavLinkItem[];
  /** Material Symbols icon cho brand. Mặc định: 'school' */
  brandIcon?: string;
}
