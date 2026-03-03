import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Building2,
  BookOpen,
  Pencil,
} from "lucide-react";
import LecturerNavbar from "../../components/lecturer/navbar/LecturerNavbar";
import { useAuthStore } from "../../stores/useAuthStore";
import StudentNavBar from "../../components/StudentNavbar";

// ─── Mock lecturer data ────────────────────────────────────────────────────────
const LECTURER = {
  name: "Dr. Alex Rivers",
  employeeId: "LEC-2019-0042",
  email: "alex.rivers@university.edu.vn",
  phone: "+84 901 234 567",
  department: "Computer Science",
  faculty: "Engineering & Technology",
  campus: "Da Nang",
  dob: "March 10, 1985",
  citizenshipId: "048198500042",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBzXuttG3iy6AOmS--FZFw64NpKFCoLUVOzqJ7BfgkAvr3mQ-26f6OTnJxbQLGIKix0NHo8wv8i2cdNaP1JhYr2GWNx2_Ut-AmXECWfKkn8opPTw2-HDc0UaDYEQR1xyn6F8z1HSyj6Op6CkzX8lfGuo48WunE-d4W0bqD3aXKmIzwgDeue06pjKryGyY8x0T4KCUGj2VQGLrPbNKHV3DlrZQpfbzH9rEzIsTX0PtsbQxU8KL-9xXoEaRac9zf7ww_qHSOwYRrya3jg",
  status: "Active Lecturer",
  title: "Senior Lecturer",
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

// ─── LecturerProfile ──────────────────────────────────────────────────────────
const LecturerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role || "student";
  const isStudent = role === "student";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">
      {isStudent ? <StudentNavBar /> : <LecturerNavbar />}

      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate(isStudent ? "/student/dashboard" : "/lecturer/dashboard")
          }
          className="group mb-8 flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 transition-colors hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[2.25rem] leading-none font-extrabold tracking-tight text-[#1E2B58] md:text-[2.75rem] dark:text-white">
            {isStudent ? "Student Profile" : "Lecturer Profile"}
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
                  alt={LECTURER.name}
                  src={LECTURER.avatar}
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
              {LECTURER.name}
            </h2>
            <p className="mt-1 text-[0.8125rem] font-bold text-[#1E2B58]/50 dark:text-white/50">
              {LECTURER.employeeId}
            </p>
            <p className="mt-0.5 text-[0.75rem] font-semibold text-[#1E2B58]/40 dark:text-white/40">
              {LECTURER.department}
            </p>

            {/* Status badge */}
            <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.6875rem] font-black tracking-widest text-emerald-600 uppercase dark:bg-emerald-500/15 dark:text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {isStudent ? "Active Student" : LECTURER.status}
            </div>

            {/* Title tag */}
            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#1E2B58]/[0.06] px-3 py-1.5 dark:bg-white/10">
              <span className="material-symbols-rounded text-[14px] text-[#1E2B58] dark:text-blue-400">
                school
              </span>
              <span className="text-[0.625rem] font-black tracking-[0.12em] text-[#1E2B58]/60 uppercase dark:text-blue-400">
                {isStudent ? "Student" : LECTURER.title}
              </span>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid w-full grid-cols-2 gap-2">
              {[
                { label: "Borrows", value: "24", icon: "inventory_2" },
                { label: "Reports", value: "7", icon: "build_circle" },
              ].map((s) => (
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
                value={LECTURER.email}
                icon={<Mail className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Department"
                value={LECTURER.department}
                icon={<BookOpen className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Phone Number"
                value={LECTURER.phone}
                icon={<Phone className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Campus"
                value={LECTURER.campus}
                icon={<MapPin className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Date of Birth"
                value={LECTURER.dob}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Faculty"
                value={LECTURER.faculty}
                icon={<Building2 className="h-3.5 w-3.5" />}
              />
              <InfoField
                label="Citizenship ID"
                value={LECTURER.citizenshipId}
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
              <InfoField
                label={isStudent ? "Student ID" : "Employee ID"}
                value={LECTURER.employeeId}
                icon={<BadgeCheck className="h-3.5 w-3.5" />}
              />
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    isStudent
                      ? "/student/change-password"
                      : "/lecturer/change-password",
                  )
                }
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
