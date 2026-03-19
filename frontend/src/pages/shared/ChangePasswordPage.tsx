import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";

// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw: string): {
  level: number;
  label: string;
  color: string;
} {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { level: 1, label: "Weak", color: "bg-red-400" },
    { level: 2, label: "Fair", color: "bg-amber-400" },
    { level: 3, label: "Good", color: "bg-blue-400" },
    { level: 4, label: "Strong", color: "bg-emerald-500" },
  ];
  return levels[score - 1] ?? levels[0];
}

// ─── PasswordInput ────────────────────────────────────────────────────────────
interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  autoComplete = "new-password",
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-[0.6875rem] font-black tracking-[0.15em] text-[#1E2B58]/50 uppercase dark:text-white/50"
      >
        {label}
      </label>
      <div
        className={`glass-card flex items-center overflow-hidden !rounded-2xl border-2 transition-colors ${
          error
            ? "!border-red-400 dark:!border-red-500"
            : "border-transparent focus-within:!border-[#1E2B58]/25 dark:focus-within:!border-white/20"
        }`}
      >
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent px-5 py-4 text-[0.875rem] font-semibold text-[#1E2B58] outline-none placeholder:text-[#1E2B58]/30 dark:text-white dark:placeholder:text-white/30"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="px-4 text-[#1E2B58]/30 transition-colors hover:text-[#1E2B58]/70 dark:text-white/30 dark:hover:text-white/70"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-red-500">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[0.75rem] font-medium text-[#1E2B58]/40 dark:text-white/40">
          {hint}
        </p>
      )}
    </div>
  );
};

// ─── Role-aware path helper ───────────────────────────────────────────────────
const ROLE_PREFIX: Record<string, string> = {
  student:  "/student",
  lecturer: "/lecturer",
  admin:    "/admin",
  technician: "/technician",
};

// ─── ChangePasswordPage ───────────────────────────────────────────────────
export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role || "student";
  const prefix = ROLE_PREFIX[role] ?? "/student";
  const profilePath   = `${prefix}/profile`;
  const dashboardPath = `${prefix}/dashboard`;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(next);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!current) errs.current = "Current password is required.";
    if (!next) errs.next = "New password is required.";
    else if (next.length < 8) errs.next = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(next))
      errs.next = "Must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(next))
      errs.next = "Must contain at least one number.";
    else if (!/[!@#$%^&*]/.test(next))
      errs.next = "Must contain at least one special character (!@#$%^&*).";
    if (!confirm) errs.confirm = "Please confirm your new password.";
    else if (next !== confirm) errs.confirm = "Passwords do not match.";
    if (current && next && current === next)
      errs.next = "New password must be different from current.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    
    try {
      await authService.changePassword(current, next);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        // Assume root cause could be incorrect current password
        setErrors({ current: err.response.data.message });
      } else {
        setErrors({ current: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full">
        <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col justify-center px-4 pt-6 sm:pt-8 pb-10 sm:px-6 xl:max-w-lg">
          <div className="extreme-glass rounded-[2rem] p-12 text-center shadow-2xl shadow-[#1E2B58]/8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-emerald-500/10 dark:bg-emerald-500/15">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="mb-2 text-2xl font-extrabold text-[#1E2B58] dark:text-white">
              Password Updated!
            </h2>
            <p className="mb-8 text-sm font-medium text-[#1E2B58]/55 dark:text-white/50">
              Your password has been changed successfully. You will need to log in again on other devices or if your session expires.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate(dashboardPath)}
                className="w-full rounded-2xl bg-[#1E2B58] px-8 py-3.5 text-[0.875rem] font-extrabold text-white shadow-lg shadow-[#1E2B58]/20 transition-all hover:scale-[1.02] hover:bg-[#1E2B58]/90 active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-8 pb-10 sm:px-6 xl:max-w-xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(profilePath)}
          className="group mb-8 flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 transition-colors hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Profile
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-[2.25rem] leading-none font-extrabold tracking-tight text-[#1E2B58] dark:text-white">
            Change Password
          </h1>
          <p className="mt-2 text-sm font-medium text-[#1E2B58]/55 dark:text-white/50">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="extreme-glass space-y-7 rounded-[2rem] p-8 shadow-2xl shadow-[#1E2B58]/8 md:p-10">
            {/* Security badge */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#1E2B58]/[0.04] p-4 dark:bg-white/[0.04]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E2B58]/[0.08] dark:bg-white/10">
                <ShieldCheck className="h-4.5 w-4.5 text-[#1E2B58] dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[0.8125rem] font-bold text-[#1E2B58] dark:text-white">
                  Security Tip
                </p>
                <p className="mt-0.5 text-[0.75rem] text-[#1E2B58]/50 dark:text-white/50">
                  Use 8+ characters with uppercase, numbers & symbols.
                </p>
              </div>
            </div>

            <PasswordInput
              id="current"
              label="Current Password"
              value={current}
              onChange={(v) => {
                setCurrent(v);
                setErrors((e) => ({ ...e, current: "" }));
              }}
              placeholder="Enter current password"
              error={errors.current}
              autoComplete="current-password"
            />

            <div className="space-y-2">
              <PasswordInput
                id="new"
                label="New Password"
                value={next}
                onChange={(v) => {
                  setNext(v);
                  setErrors((e) => ({ ...e, next: "" }));
                }}
                placeholder="Enter new password"
                error={errors.next}
                hint="At least 8 characters, 1 uppercase letter, 1 number, 1 special character."
              />
              {/* Strength meter */}
              {next && (
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level
                            ? strength.color
                            : "bg-[#1E2B58]/10 dark:bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[0.6875rem] font-black tracking-wider uppercase ${
                      strength.level <= 1
                        ? "text-red-400"
                        : strength.level === 2
                          ? "text-amber-400"
                          : strength.level === 3
                            ? "text-blue-400"
                            : "text-emerald-500"
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <PasswordInput
              id="confirm"
              label="Confirm New Password"
              value={confirm}
              onChange={(v) => {
                setConfirm(v);
                setErrors((e) => ({ ...e, confirm: "" }));
              }}
              placeholder="Re-enter new password"
              error={errors.confirm}
            />

            {/* Requirements checklist */}
            {next && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "8+ characters", ok: next.length >= 8 },
                  { label: "Uppercase letter", ok: /[A-Z]/.test(next) },
                  { label: "Number", ok: /[0-9]/.test(next) },
                  { label: "Special char", ok: /[!@#$%^&*]/.test(next) },
                  {
                    label: "Passwords match",
                    ok: !!confirm && next === confirm,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-1.5 text-[0.75rem] font-semibold ${
                      r.ok
                        ? "text-emerald-500"
                        : "text-[#1E2B58]/40 dark:text-white/40"
                    }`}
                  >
                    {r.ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-current opacity-40" />
                    )}
                    {r.label}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#1E2B58] px-8 py-4 text-[0.9375rem] font-extrabold text-white shadow-lg shadow-[#1E2B58]/20 transition-all hover:scale-[1.01] hover:bg-[#1E2B58]/90 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
