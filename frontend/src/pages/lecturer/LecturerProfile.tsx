import {
    ArrowLeft,
    BadgeCheck,
    BookOpen,
    Building2,
    Calendar,
    Mail,
    MapPin,
    Pencil,
    Phone,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

// ─── Mock fallback data (used when real data is unavailable) ──────────────────
const FALLBACK = {
  employeeId: "—",
  phone: "—",
  department: "—",
  faculty: "—",
  campus: "—",
  dob: "—",
  citizenshipId: "—",
};

// ─── InfoField ────────────────────────────────────────────────────────────────
interface InfoFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon }) => (
  <div className="space-y-2.5">
    <label className="flex items-center gap-2 text-[0.625rem] font-black tracking-[0.18em] text-[#1E2B58]/40 uppercase dark:text-white/40">
      <span className="text-[#1E2B58]/50 dark:text-white/50">{icon}</span>
      {label}
    </label>
    <div className="glass-card w-full !rounded-2xl px-5 py-3.5 text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">
      {value}
    </div>
  </div>
);

// ─── Role-aware helpers ───────────────────────────────────────────────────────
const ROLE_PREFIX: Record<string, string> = {
  student:  "/student",
  lecturer: "/lecturer",
  admin:    "/admin",
};

const ROLE_LABEL: Record<string, string> = {
  student:  "Student Profile",
  lecturer: "Lecturer Profile",
  admin:    "Admin Profile",
};

const ROLE_STATUS: Record<string, string> = {
  student:  "Active Student",
  lecturer: "Active Lecturer",
  admin:    "Active Admin",
};

const ROLE_TITLE_ICON: Record<string, string> = {
  student:  "school",
  lecturer: "school",
  admin:    "shield_person",
};

const ROLE_TITLE_LABEL: Record<string, string> = {
  student:  "Student",
  lecturer: "Senior Lecturer",
  admin:    "Super Admin",
};

// Quick stats per role
const ROLE_STATS: Record<string, { label: string; value: string; icon: string }[]> = {
  student:  [
    { label: "Borrows",  value: "24", icon: "inventory_2"  },
    { label: "Reports",  value: "7",  icon: "build_circle" },
  ],
  lecturer: [
    { label: "Borrows",  value: "24", icon: "inventory_2"  },
    { label: "Reports",  value: "7",  icon: "build_circle" },
  ],
  admin: [
    { label: "Users",      value: "52", icon: "group"    },
    { label: "Equipment",  value: "64", icon: "devices"  },
  ],
};

// ─── LecturerProfile ──────────────────────────────────────────────────────────
const LecturerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role ?? "student";
  const prefix = ROLE_PREFIX[role] ?? "/student";

  // Resolve display values from real user data with fallback
  const displayName = user?.displayName ?? user?.username ?? "—";
  const email       = user?.email ?? "—";
  const avatarUrl   = user?.avatarUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1E2B58&color=fff&size=200`;

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`${prefix}/dashboard`)}
          className="group mb-8 flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 transition-colors hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[2.25rem] leading-none font-extrabold tracking-tight text-[#1E2B58] md:text-[2.75rem] dark:text-white">
            {ROLE_LABEL[role] ?? "My Profile"}
          </h1>
          <p className="mt-2 text-sm font-medium text-[#1E2B58]/55 dark:text-white/50">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Card */}
        <div className="extreme-glass flex flex-col overflow-hidden rounded-[2rem] shadow-2xl shadow-[#1E2B58]/8 lg:flex-row">
          {/* ── Left: Avatar column ── */}
          <div className="flex shrink-0 flex-col items-center justify-center border-b border-[#1E2B58]/[0.06] p-10 text-center lg:w-[17rem] lg:border-r lg:border-b-0 dark:border-white/[0.05]">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="h-44 w-44 overflow-hidden rounded-[1.75rem] shadow-2xl ring-4 shadow-[#1E2B58]/15 ring-white/60 dark:ring-slate-700">
                <img
                  alt={displayName}
                  src={avatarUrl}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Edit overlay */}
              <button
                type="button"
                className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E2B58] shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-blue-500"
                title="Change avatar"
              >
                <Pencil className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Name */}
            <h2 className="text-xl leading-tight font-extrabold text-[#1E2B58] dark:text-white">
              {displayName}
            </h2>
            <p className="mt-1 text-[0.8125rem] font-bold text-[#1E2B58]/50 dark:text-white/50">
              {user?._id ? `ID: ${user._id.slice(-8).toUpperCase()}` : FALLBACK.employeeId}
            </p>
            <p className="mt-0.5 text-[0.75rem] font-semibold text-[#1E2B58]/40 dark:text-white/40">
              {FALLBACK.department}
            </p>

            {/* Status badge */}
            <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.6875rem] font-black tracking-widest text-emerald-600 uppercase dark:bg-emerald-500/15 dark:text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {ROLE_STATUS[role] ?? "Active"}
            </div>

            {/* Title tag */}
            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#1E2B58]/[0.06] px-3 py-1.5 dark:bg-white/10">
              <span className="material-symbols-rounded text-[14px] text-[#1E2B58] dark:text-blue-400">
                {ROLE_TITLE_ICON[role] ?? "school"}
              </span>
              <span className="text-[0.625rem] font-black tracking-[0.12em] text-[#1E2B58]/60 uppercase dark:text-blue-400">
                {ROLE_TITLE_LABEL[role] ?? role}
              </span>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid w-full grid-cols-2 gap-2">
              {(ROLE_STATS[role] ?? ROLE_STATS.student).map((s) => (
                <div
                  key={s.label}
                  className="glass-card !rounded-xl p-3 text-center"
                >
                  <span className="material-symbols-rounded text-[18px] text-[#1E2B58]/50 dark:text-white/50">
                    {s.icon}
                  </span>
                  <p className="mt-0.5 text-lg font-extrabold text-[#1E2B58] dark:text-white">
                    {s.value}
                  </p>
                  <p className="text-[0.5625rem] font-bold tracking-wider text-[#1E2B58]/40 uppercase dark:text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Info grid ── */}
          <div className="flex-1 p-8 md:p-12">
            <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
              <InfoField
                label="Email Address"
                value={email}
                icon={<Mail className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Department"
                value={FALLBACK.department}
                icon={<BookOpen className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Phone Number"
                value={FALLBACK.phone}
                icon={<Phone className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Campus"
                value={FALLBACK.campus}
                icon={<MapPin className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Date of Birth"
                value={FALLBACK.dob}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Faculty"
                value={FALLBACK.faculty}
                icon={<Building2 className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Citizenship ID"
                value={FALLBACK.citizenshipId}
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
              <InfoField
                label={role === "student" ? "Student ID" : role === "admin" ? "Admin ID" : "Employee ID"}
                value={user?._id ? user._id.slice(-8).toUpperCase() : FALLBACK.employeeId}
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`${prefix}/change-password`)}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#1E2B58] px-8 py-3.5 text-[0.875rem] font-extrabold text-white shadow-lg shadow-[#1E2B58]/20 transition-all hover:scale-[1.02] hover:bg-[#1E2B58]/90 active:scale-95"
              >
                <span className="material-symbols-rounded text-[18px]">
                  key
                </span>
                Change Password
              </button>
              <button
                type="button"
                disabled
                className="glass-card flex cursor-not-allowed items-center justify-center gap-2.5 !rounded-2xl px-8 py-3.5 text-[0.875rem] font-extrabold text-[#1E2B58]/40 dark:text-white/30"
                title="Coming soon"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
                <span className="rounded-md bg-[#1E2B58]/[0.06] px-1.5 py-0.5 text-[0.5625rem] font-black tracking-wider uppercase">
                  Soon
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerProfile;
