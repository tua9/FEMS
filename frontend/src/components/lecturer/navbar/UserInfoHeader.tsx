import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const UserInfoHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const profilePath =
    user?.role === "student" ? "/student/profile" : "/lecturer/profile";

  return (
    <button
      type="button"
      onClick={() => navigate(profilePath)}
      className="group w-full border-b border-[#1E2B58]/[0.06] px-5 py-4 text-left transition-colors hover:bg-[#1E2B58]/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]"
    >
      {/* Avatar + name row */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-11 w-11 overflow-hidden rounded-2xl shadow-md ring-2 ring-[#1E2B58]/15 dark:ring-white/20">
            {user?.avatarUrl ? (
              <img
                alt={user.displayName}
                src={user.avatarUrl}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1E2B58] text-sm font-bold text-white">
                {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          {/* Online indicator */}
          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8125rem] font-extrabold leading-tight text-[#1E2B58] dark:text-white">
            {user?.displayName ?? "—"}
          </p>
          <p className="mt-0.5 truncate text-[0.6875rem] font-semibold text-slate-400 dark:text-slate-500">
            {user?.email ?? ""}
          </p>
        </div>

        <span className="material-symbols-rounded shrink-0 text-[16px] text-[#1E2B58]/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#1E2B58]/50 dark:text-white/20 dark:group-hover:text-white/50">
          chevron_right
        </span>
      </div>

      {/* Role badge */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2B58]/[0.06] px-2.5 py-1 dark:bg-white/10">
          <span className="material-symbols-rounded text-[13px] text-[#1E2B58] dark:text-blue-400">
            school
          </span>
          <span className="text-[0.5625rem] font-black uppercase tracking-[0.12em] text-[#1E2B58]/70 dark:text-blue-400">
            {user?.role ?? ""}
          </span>
        </div>
      </div>
    </button>
  );
};

export default UserInfoHeader;
