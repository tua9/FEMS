import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// ── Validation schema ─────────────────────────────────────────────────────────

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters long")
      .regex(/[a-zA-Z]/, "Must include letters (a-z, A-Z)")
      .regex(/[0-9]/, "Must include numbers (0-9)")
      .regex(/[@#$%^&*!]/, "Must include special characters (@, #, $, …)"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

// ── Shared styles ─────────────────────────────────────────────────────────────

const cardCls = cn(
  "w-full rounded-[2.5rem] border border-white/40 bg-white/75 p-8 backdrop-blur-xl",
  "shadow-[0_24px_70px_-8px_rgba(0,0,0,0.26)] dark:shadow-[0_24px_70px_-8px_rgba(0,0,0,0.82)]",
  "dark:border-slate-600/50 dark:bg-slate-800/90 md:p-12",
);

const submitBtnCls = cn(
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl",
  "bg-slate-900 text-[0.9rem] font-semibold text-white",
  "shadow-[0_10px_25px_-5px_rgba(30,41,59,0.3)]",
  "transition-all duration-200 hover:bg-slate-800 active:scale-[0.99]",
  "disabled:opacity-60",
  "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
  "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)]",
);

const inputCls =
  "h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-11 text-[0.9rem] font-normal text-slate-700 placeholder:text-slate-300 outline-none transition-all duration-150 focus:border-slate-400/50 focus:ring-2 focus:ring-slate-900/8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] dark:border-slate-500 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-slate-500/60 dark:focus:ring-white/8 dark:shadow-none";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-200">
    {children}
  </label>
);

// ── Password requirement row ──────────────────────────────────────────────────

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
          met
            ? "bg-emerald-500"
            : "bg-slate-200 dark:bg-slate-700",
        )}
      >
        {met && (
          <span className="material-symbols-rounded text-[10px] font-bold text-white">
            check
          </span>
        )}
      </span>
      <span
        className={cn(
          "text-[0.8rem] transition-colors duration-200",
          met
            ? "text-slate-700 dark:text-slate-300"
            : "text-slate-400 dark:text-slate-500",
        )}
      >
        {label}
      </span>
    </li>
  );
}

// ── PasswordResetSuccessModal ─────────────────────────────────────────────────

const REDIRECT_SECONDS = 5;

interface PasswordResetSuccessModalProps {
  open: boolean;
}

export function PasswordResetSuccessModal({ open }: PasswordResetSuccessModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  // Countdown → auto-redirect
  useEffect(() => {
    if (!open) return;
    setCountdown(REDIRECT_SECONDS);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) {
      navigate("/login");
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [open, countdown, navigate]);

  if (!open) return null;

  return (
    // ── Backdrop ──
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm dark:bg-slate-950/50" />

      {/* Modal card */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-4xl border border-white/50 bg-white/90 px-8 py-10 text-center backdrop-blur-xl",
          "shadow-[0_30px_80px_-10px_rgba(0,0,0,0.28)]",
          "dark:border-slate-600/50 dark:bg-slate-800/95 dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.82)]",
          "animate-in fade-in zoom-in-95 duration-300",
        )}
      >
        {/* Glow check icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 dark:bg-emerald-500/15 blur-xl" />
          {/* Inner circle */}
          <div
            className={cn(
              "relative flex h-20 w-20 items-center justify-center rounded-full",
              "bg-linear-to-br from-emerald-50 to-emerald-100 shadow-[0_0_0_6px_rgba(52,211,153,0.15)]",
              "dark:from-emerald-900/40 dark:to-emerald-800/40 dark:shadow-[0_0_0_6px_rgba(52,211,153,0.1)]",
            )}
          >
            <span className="material-symbols-rounded text-[2.2rem] font-bold text-emerald-500 dark:text-emerald-400">
              check
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-3 text-[1.4rem] font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
          Password Reset<br />Successful!
        </h2>

        {/* Description */}
        <p className="mx-auto mb-7 max-w-65 text-[0.875rem] font-medium leading-relaxed text-slate-500 dark:text-slate-300">
          Your password has been reset. You can now log in to your account with your new password.
        </p>

        {/* Go to Login button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5",
            "bg-slate-900 text-[0.9rem] font-semibold text-white",
            "shadow-[0_10px_25px_-5px_rgba(30,41,59,0.35)]",
            "transition-all duration-200 hover:bg-slate-800 active:scale-[0.99]",
            "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
            "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)]",
          )}
        >
          Go to Login
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
        </button>

        {/* Countdown */}
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-300">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}…
        </p>
      </div>
    </div>
  );
}

// ── SetNewPasswordForm ────────────────────────────────────────────────────────

interface SetNewPasswordFormProps extends React.ComponentProps<"div"> {
  onSuccess: () => void;
}

export function SetNewPasswordForm({
  onSuccess,
  className,
  ...props
}: SetNewPasswordFormProps) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") ?? "";

  // ── Live requirement checks ──────────────────────────────────────────────
  const reqs = [
    { label: "At least 8 characters long", met: passwordValue.length >= 8 },
    { label: "Must include letters (a-z, A-Z)", met: /[a-zA-Z]/.test(passwordValue) },
    { label: "Must include numbers (0-9)", met: /[0-9]/.test(passwordValue) },
    { label: "Must include special characters (@, #, $, …)", met: /[@#$%^&*!]/.test(passwordValue) },
  ];

  const onSubmit = async (_data: SetPasswordValues) => {
    // TODO: wire up real reset API call
    await new Promise((r) => setTimeout(r, 800));
    setShowModal(true);
    onSuccess();
  };

  return (
    <>
      <PasswordResetSuccessModal open={showModal} />

      <div className={cn("w-full", className)} {...props}>
        <div className={cardCls}>
          {/* Lock icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-100">
            <span className="material-symbols-rounded text-2xl text-white dark:text-slate-900">
              lock
            </span>
          </div>

          {/* Heading */}
          <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Set New Password
          </h2>
          <p className="mx-auto mb-7 max-w-xs text-center text-sm font-medium text-slate-500 dark:text-slate-300">
            Please enter your new password to regain access to your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* New password */}
            <div className="flex flex-col gap-2">
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <span className="material-symbols-rounded absolute top-1/2 left-3.5 -translate-y-1/2 select-none text-[18px] text-slate-300 dark:text-slate-600">
                  lock
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    inputCls,
                    errors.password && "border-red-400 focus:border-red-400 dark:border-red-500",
                  )}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-300 transition hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                >
                  <span className="material-symbols-rounded select-none text-[18px]">
                    {showPw ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Confirm New Password</FieldLabel>
              <div className="relative">
                <span className="material-symbols-rounded absolute top-1/2 left-3.5 -translate-y-1/2 select-none text-[18px] text-slate-300 dark:text-slate-600">
                  lock
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("confirm")}
                  className={cn(
                    inputCls,
                    errors.confirm && "border-red-400 focus:border-red-400 dark:border-red-500",
                  )}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-300 transition hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                >
                  <span className="material-symbols-rounded select-none text-[18px]">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.confirm && (
                <p className="text-[0.775rem] font-medium text-red-500 dark:text-red-400">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            {/* Requirements checklist */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 dark:border-slate-700/50 dark:bg-slate-900/40">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Password Requirements:
              </p>
              <ul className="flex flex-col gap-1.5">
                {reqs.map((r) => (
                  <Requirement key={r.label} met={r.met} label={r.label} />
                ))}
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={submitBtnCls}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  Resetting…
                </span>
              ) : (
                <>
                  Reset Password
                  <span className="material-symbols-rounded text-[18px]">
                    autorenew
                  </span>
                </>
              )}
            </button>

            {/* Footer step indicator */}
            <p className="pt-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
              Security Verification Step 2/2
            </p>

          </form>
        </div>
      </div>
    </>
  );
}
