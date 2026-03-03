import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, BadgeCheck, Building2, BookOpen, Pencil } from 'lucide-react';
import LecturerNavbar from '../../components/lecturer/navbar/LecturerNavbar';

// ─── Mock lecturer data ────────────────────────────────────────────────────────
const LECTURER = {
    name: 'Dr. Alex Rivers',
    employeeId: 'LEC-2019-0042',
    email: 'alex.rivers@university.edu.vn',
    phone: '+84 901 234 567',
    department: 'Computer Science',
    faculty: 'Engineering & Technology',
    campus: 'Da Nang',
    dob: 'March 10, 1985',
    citizenshipId: '048198500042',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXuttG3iy6AOmS--FZFw64NpKFCoLUVOzqJ7BfgkAvr3mQ-26f6OTnJxbQLGIKix0NHo8wv8i2cdNaP1JhYr2GWNx2_Ut-AmXECWfKkn8opPTw2-HDc0UaDYEQR1xyn6F8z1HSyj6Op6CkzX8lfGuo48WunE-d4W0bqD3aXKmIzwgDeue06pjKryGyY8x0T4KCUGj2VQGLrPbNKHV3DlrZQpfbzH9rEzIsTX0PtsbQxU8KL-9xXoEaRac9zf7ww_qHSOwYRrya3jg',
    status: 'Active Lecturer',
    title: 'Senior Lecturer',
};

// ─── InfoField ────────────────────────────────────────────────────────────────
interface InfoFieldProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon }) => (
    <div className="space-y-2.5">
        <label className="flex items-center gap-2 text-[0.625rem] font-black uppercase tracking-[0.18em] text-[#1E2B58]/40 dark:text-white/40">
            <span className="text-[#1E2B58]/50 dark:text-white/50">{icon}</span>
            {label}
        </label>
        <div className="w-full glass-card !rounded-2xl px-5 py-3.5 text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">
            {value}
        </div>
    </div>
);

// ─── LecturerProfile ──────────────────────────────────────────────────────────
const LecturerProfile: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#e0eafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <LecturerNavbar />

            <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-5xl mx-auto flex-1 flex flex-col">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate('/lecturer/dashboard')}
                    className="flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dashboard
                </button>

                {/* Page title */}
                <div className="mb-8">
                    <h1 className="text-[2.25rem] md:text-[2.75rem] font-extrabold text-[#1E2B58] dark:text-white leading-none tracking-tight">
                        Lecturer Profile
                    </h1>
                    <p className="mt-2 text-[#1E2B58]/55 dark:text-white/50 text-sm font-medium">
                        Manage your personal information and account security.
                    </p>
                </div>

                {/* Card */}
                <div className="extreme-glass rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-[#1E2B58]/8">

                    {/* ── Left: Avatar column ── */}
                    <div className="lg:w-[17rem] shrink-0 p-10 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-[#1E2B58]/[0.06] dark:border-white/[0.05]">
                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="w-44 h-44 rounded-[1.75rem] overflow-hidden ring-4 ring-white/60 dark:ring-slate-700 shadow-2xl shadow-[#1E2B58]/15">
                                <img
                                    alt={LECTURER.name}
                                    src={LECTURER.avatar}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Edit overlay */}
                            <button
                                type="button"
                                className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#1E2B58] dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                title="Change avatar"
                            >
                                <Pencil className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Name */}
                        <h2 className="text-xl font-extrabold text-[#1E2B58] dark:text-white leading-tight">
                            {LECTURER.name}
                        </h2>
                        <p className="text-[0.8125rem] font-bold text-[#1E2B58]/50 dark:text-white/50 mt-1">
                            {LECTURER.employeeId}
                        </p>
                        <p className="text-[0.75rem] font-semibold text-[#1E2B58]/40 dark:text-white/40 mt-0.5">
                            {LECTURER.department}
                        </p>

                        {/* Status badge */}
                        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full text-[0.6875rem] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {LECTURER.status}
                        </div>

                        {/* Title tag */}
                        <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2B58]/[0.06] dark:bg-white/10 rounded-xl">
                            <span className="material-symbols-rounded text-[14px] text-[#1E2B58] dark:text-blue-400">school</span>
                            <span className="text-[0.625rem] font-black uppercase tracking-[0.12em] text-[#1E2B58]/60 dark:text-blue-400">
                                {LECTURER.title}
                            </span>
                        </div>

                        {/* Quick stats */}
                        <div className="mt-8 w-full grid grid-cols-2 gap-2">
                            {[
                                { label: 'Borrows', value: '24', icon: 'inventory_2' },
                                { label: 'Reports', value: '7',  icon: 'build_circle' },
                            ].map(s => (
                                <div key={s.label} className="glass-card !rounded-xl p-3 text-center">
                                    <span className="material-symbols-rounded text-[18px] text-[#1E2B58]/50 dark:text-white/50">{s.icon}</span>
                                    <p className="text-lg font-extrabold text-[#1E2B58] dark:text-white mt-0.5">{s.value}</p>
                                    <p className="text-[0.5625rem] font-bold uppercase tracking-wider text-[#1E2B58]/40 dark:text-white/40">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Info grid ── */}
                    <div className="flex-1 p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                            <InfoField label="Email Address"   value={LECTURER.email}         icon={<Mail className="w-3.5 h-3.5" />} />
                            <InfoField label="Department"      value={LECTURER.department}    icon={<BookOpen className="w-3.5 h-3.5" />} />
                            <InfoField label="Phone Number"    value={LECTURER.phone}         icon={<Phone className="w-3.5 h-3.5" />} />
                            <InfoField label="Campus"          value={LECTURER.campus}        icon={<MapPin className="w-3.5 h-3.5" />} />
                            <InfoField label="Date of Birth"   value={LECTURER.dob}           icon={<Calendar className="w-3.5 h-3.5" />} />
                            <InfoField label="Faculty"         value={LECTURER.faculty}       icon={<Building2 className="w-3.5 h-3.5" />} />
                            <InfoField label="Citizenship ID"  value={LECTURER.citizenshipId} icon={<BadgeCheck className="w-3.5 h-3.5" />} />
                            <InfoField label="Employee ID"     value={LECTURER.employeeId}    icon={<BadgeCheck className="w-3.5 h-3.5" />} />
                        </div>

                        {/* Action buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/lecturer/change-password')}
                                className="flex items-center justify-center gap-2.5 bg-[#1E2B58] text-white px-8 py-3.5 rounded-2xl font-extrabold text-[0.875rem] hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
                            >
                                <span className="material-symbols-rounded text-[18px]">key</span>
                                Change Password
                            </button>
                            <button
                                type="button"
                                disabled
                                className="flex items-center justify-center gap-2.5 glass-card !rounded-2xl px-8 py-3.5 font-extrabold text-[0.875rem] text-[#1E2B58]/40 dark:text-white/30 cursor-not-allowed"
                                title="Coming soon"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Profile
                                <span className="text-[0.5625rem] font-black uppercase tracking-wider bg-[#1E2B58]/[0.06] px-1.5 py-0.5 rounded-md">
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
