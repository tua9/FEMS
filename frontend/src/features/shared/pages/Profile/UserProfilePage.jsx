import { ArrowLeft, Pencil } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import {
 ROLE_PREFIX,
 ROLE_STATUS,
 ROLE_TITLE_ICON,
 ROLE_TITLE_LABEL,
 ROLE_STATS_CONFIG,
 getInfoFields,
} from "./profileConfig";
import ProfileEditModal from "./ProfileEditModal";

// ─── InfoField Component ────────────────────────────────────────────────────────
const InfoField = ({ label, value, icon: Icon }) => (
 <div className="space-y-2.5">
 <label className="flex items-center gap-2 text-[0.625rem] font-black tracking-[0.18em] text-[#1E2B58]/40 uppercase dark:text-white/40">
 <span className="text-[#1E2B58]/50 dark:text-white/50"><Icon className="h-3.5 w-3.5" /></span>
 {label}
 </label>
 <div className="glass-card w-full !rounded-2xl px-5 py-3.5 text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">
 {value}
 </div>
 </div>
);

// ─── UserProfilePage Component ──────────────────────────────────────────────────
const UserProfilePage = () => {
 const navigate = useNavigate();
 const { user } = useAuthStore();
 const [showEditModal, setShowEditModal] = React.useState(false);
 
 // Data stores
 const { borrowRequests, fetchMyBorrowRequests, fetchAllBorrowRequests } = useBorrowRequestStore();
 const { myReports, fetchMyReports } = useReportStore();
 const { users, fetchAllUsers } = useUserStore();
 const { equipments, fetchAll: fetchAllEquipment } = useEquipmentStore();

 const role = user?.role ?? "student";
 const prefix = ROLE_PREFIX[role] ?? "/student";

 useEffect(() => {
 if (role === "student" || role === "lecturer") {
 fetchMyBorrowRequests();
 fetchMyReports();
 } else if (role === "admin") {
 fetchAllUsers();
 fetchAllEquipment();
 } else if (role === "technician") {
 fetchAllBorrowRequests();
 }
 }, [role]);

 const displayName = user?.displayName ?? user?.username ?? "—";
 const avatarUrl = user?.avatarUrl
 ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1E2B58&color=fff&size=200`;

 const fields = getInfoFields(role);

 // Dynamic stats calculation
 const getStatValue = (key) => {
 switch (key) {
 case "borrows": return borrowRequests.length.toString();
 case "reports": return myReports.length.toString();
 case "users": return users.length.toString();
 case "equipment": return equipments.length.toString();
 case "tasks": return borrowRequests.filter(r => ["approved", "hand_over"].includes(r.status)).length.toString();
 case "active": return borrowRequests.filter(r => r.status === "hand_over").length.toString();
 default: return "0";
 }
 };

 return (
 <div className="w-full">
 <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-8 pb-10 sm:px-6 xl:max-w-5xl">
 {/* Back Button */}
 <button
 type="button"
 onClick={() => navigate(`${prefix}/dashboard`)}
 className="group mb-8 flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 transition-colors hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
 >
 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
 Back to Dashboard
 </button>

 {/* Page Title */}
 <div className="mb-8">
 <h1 className="text-[2.25rem] leading-none font-extrabold tracking-tight text-[#1E2B58] md:text-[2.75rem] dark:text-white capitalize">
 {role} Profile
 </h1>
 <p className="mt-2 text-sm font-medium text-[#1E2B58]/55 dark:text-white/50">
 Manage your personal information and account security.
 </p>
 </div>

 {/* Profile Card */}
 <div className="extreme-glass flex flex-col overflow-hidden rounded-[2rem] shadow-2xl shadow-[#1E2B58]/8 lg:flex-row">
 
 {/* Left Side: Avatar and Stats */}
 <div className="flex shrink-0 flex-col items-center justify-center border-b border-[#1E2B58]/[0.06] p-10 text-center lg:w-[17rem] lg:border-r lg:border-b-0 dark:border-white/[0.05]">
 <div className="relative mb-6">
 <div className="h-44 w-44 overflow-hidden rounded-[1.75rem] shadow-2xl ring-4 shadow-[#1E2B58]/15 ring-white/60 dark:ring-slate-700">
 <img alt={displayName} src={avatarUrl} className="h-full w-full object-cover" />
 </div>
 <button
 type="button"
 className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E2B58] shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-blue-500"
 title="Change avatar"
 >
 <Pencil className="h-4 w-4 text-white" />
 </button>
 </div>

 <h2 className="text-xl leading-tight font-extrabold text-[#1E2B58] dark:text-white">{displayName}</h2>
 <p className="mt-1 text-[0.8125rem] font-bold text-[#1E2B58]/50 dark:text-white/50">
 {user?._id ? `ID: ${user._id.slice(-8).toUpperCase()}` : "—"}
 </p>

 <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.6875rem] font-black tracking-widest text-emerald-600 uppercase dark:bg-emerald-500/15 dark:text-emerald-400">
 <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
 {ROLE_STATUS[role] ?? "Active"}
 </div>

 <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#1E2B58]/[0.06] px-3 py-1.5 dark:bg-white/10">
 <span className="material-symbols-rounded text-[14px] text-[#1E2B58] dark:text-blue-400">
 {ROLE_TITLE_ICON[role] ?? "school"}
 </span>
 <span className="text-[0.625rem] font-black tracking-[0.12em] text-[#1E2B58]/60 uppercase dark:text-blue-400">
 {ROLE_TITLE_LABEL[role] ?? role}
 </span>
 </div>

 <div className="mt-8 grid w-full grid-cols-2 gap-2">
 {(ROLE_STATS_CONFIG[role] ?? ROLE_STATS_CONFIG.student).map((s) => (
 <div key={s.label} className="glass-card !rounded-xl p-3 text-center">
 <span className="material-symbols-rounded text-[18px] text-[#1E2B58]/50 dark:text-white/50">{s.icon}</span>
 <p className="mt-0.5 text-lg font-extrabold text-[#1E2B58] dark:text-white">{getStatValue(s.key)}</p>
 <p className="text-[0.5625rem] font-bold tracking-wider text-[#1E2B58]/40 uppercase dark:text-white/40">{s.label}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="flex-1 p-8 md:p-12">
 <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
 {fields.map((field, idx) => {
 const key = field.key;
 let value = "—";
 
 if (key === "_id" && user?._id) {
 value = user._id.slice(-8).toUpperCase();
 } else if (user && user[key]) {
 value = String(user[key]);
 }
 
 return (
 <InfoField
 key={idx}
 label={field.label}
 value={value}
 icon={field.icon}
 />
 );
 })}
 </div>

 <div className="mt-10 flex flex-col gap-3 sm:flex-row">
 <button
 type="button"
 onClick={() => navigate(`${prefix}/change-password`)}
 className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#1E2B58] px-8 py-3.5 text-[0.875rem] font-extrabold text-white shadow-lg shadow-[#1E2B58]/20 transition-all hover:scale-[1.02] hover:bg-[#1E2B58]/90 active:scale-95"
 >
 <span className="material-symbols-rounded text-[18px]">key</span>
 Change Password
 </button>
 <button
 type="button"
 onClick={() => setShowEditModal(true)}
 className="glass-card flex items-center justify-center gap-2.5 !rounded-2xl px-8 py-3.5 text-[0.875rem] font-extrabold text-[#1E2B58] transition-all hover:scale-[1.02] active:scale-95 dark:text-white"
 >
 <Pencil className="h-4 w-4" />
 Edit Profile
 </button>
 </div>
 </div>
 </div>
 </main>

 {showEditModal && (
 <ProfileEditModal onClose={() => setShowEditModal(false)} />
 )}
 </div>
 );
};

export default UserProfilePage;
