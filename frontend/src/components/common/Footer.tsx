// ─── Shared Footer — dùng cho tất cả role ─────────────────────────────────────

const ROLE_ICONS: Record<string, string> = {
  student:    'construction',
  lecturer:   'construction',
  admin:      'biotech',
  technician: 'build_circle',
  auth:       'verified_user',
};

interface FooterProps {
  /** Role để chọn icon thứ 3. Không truyền → fallback 'construction' */
  role?: string;
  className?: string;
}

export default function Footer({ role, className }: FooterProps) {
  const thirdIcon = ROLE_ICONS[role ?? ''] ?? 'construction';

  return (
    <footer
      className={
        className ??
        'mt-4 flex w-full shrink-0 flex-col items-center justify-center gap-2 border-t border-[#1E2B58]/50 px-4 py-5 text-center opacity-50 dark:border-white/50'
      }
    >
      <div className="flex items-center justify-center gap-5 text-[#1E2B58] dark:text-white">
        <span className="material-symbols-rounded text-base">school</span>
        <span className="material-symbols-rounded text-base">verified_user</span>
        <span className="material-symbols-rounded text-base">{thirdIcon}</span>
      </div>
      <p className="text-[0.6rem] font-black tracking-[0.2em] text-[#1E2B58] uppercase dark:text-white">
        Facility &amp; Equipment Management System — F-EMS 2026
      </p>
    </footer>
  );
}
