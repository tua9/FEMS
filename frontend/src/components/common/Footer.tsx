// ─── Shared Footer — dùng cho tất cả role ─────────────────────────────────────
// Các icon là: school | verified_user | icon thứ 3 khác nhau theo role

const ICONS: Record<string, string> = {
  student: 'construction',
  lecturer: 'construction',
  admin: 'biotech',
  technician: 'build_circle',
};

interface FooterProps {
  /** Tên role để chọn icon thứ 3. Nếu không truyền → mặc định 'construction' */
  role?: string;
  /** Override toàn bộ className của <footer> nếu cần */
  className?: string;
}

export default function Footer({ role, className }: FooterProps) {
  const thirdIcon = ICONS[role ?? ''] ?? 'construction';

  return (
    <footer
      className={
        className ??
        'mt-8 flex w-full shrink-0 flex-col items-center justify-center gap-4 border-t border-[#1E2B58]/10 px-4 py-8 text-center opacity-40 md:gap-6 md:py-16 dark:border-white/10'
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-6 text-[#1E2B58] md:gap-10 dark:text-white">
        <span className="material-symbols-rounded text-xl md:text-2xl">school</span>
        <span className="material-symbols-rounded text-xl md:text-2xl">verified_user</span>
        <span className="material-symbols-rounded text-xl md:text-2xl">{thirdIcon}</span>
      </div>
      <p className="text-[0.625rem] font-black tracking-[0.2em] text-[#1E2B58] uppercase md:text-xs md:tracking-[0.4em] dark:text-white">
        Facility &amp; Equipment Management System — F-EMS 2024
      </p>
    </footer>
  );
}
