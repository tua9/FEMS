import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// ── Shared card + button styles ───────────────────────────────────────────────

const cardCls = cn(
  "w-full rounded-[2.5rem] border border-white/40 bg-white/75 p-8 backdrop-blur-xl",
  "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.65)]",
  "dark:border-slate-600/50 dark:bg-slate-800/90 md:p-12",
);

const submitBtnCls = cn(
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl",
  "bg-[#1E2B58] text-[0.9rem] font-semibold text-white",
  "shadow-[0_10px_25px_-5px_rgba(30,43,88,0.35)]",
  "transition-all duration-200 hover:bg-[#162044] active:scale-[0.99]",
  "disabled:opacity-60",
  "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
  "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)]",
);

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// ── OtpVerificationForm ───────────────────────────────────────────────────────

interface OtpVerificationFormProps extends React.ComponentProps<"div"> {
  email: string;
  /** Called with the 6-digit code when the user clicks "Verify & Continue" */
  onVerified: (code: string) => Promise<{ success: boolean }>;
  onBack: () => void;
}

export function OtpVerificationForm({
  email,
  onVerified,
  onBack,
  className,
  ...props
}: OtpVerificationFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Input handlers ───────────────────────────────────────────────────────
  const handleChange = (idx: number, val: string) => {
    // Accept only digits
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError(null);
    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    setError(null);
    // Focus last filled or last input
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const result = await onVerified(code);
    if (!result.success) {
      setError("Incorrect verification code. Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
    setIsSubmitting(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    inputRefs.current[0]?.focus();
    // TODO: trigger real resend API
  };

  const isFilled = digits.every((d) => d !== "");
  const hasError = !!error;

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cardCls}>
        {/* Back arrow */}
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_back</span>
        </button>

        {/* Shield icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-100">
          <span className="material-symbols-rounded text-2xl text-white dark:text-slate-900">
            shield_lock
          </span>
        </div>

        <p className="mx-auto mb-7 max-w-xs text-center text-sm text-slate-500 dark:text-slate-400">
          We have sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>.
          Please enter it below to continue.
        </p>

        {/* OTP inputs */}
        <div className="mb-2 flex justify-center gap-2.5 sm:gap-3">
          {digits.map((d, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={cn(
                "h-12 w-11 rounded-xl border-2 text-center text-[1.1rem] font-bold outline-none transition-all duration-150 sm:h-13 sm:w-12",
                "bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]",
                "dark:bg-slate-900/70 dark:text-white",
                hasError
                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/40 dark:border-red-500 dark:focus:ring-red-500/30"
                  : d
                    ? "border-slate-900 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-300 dark:focus:ring-white/10"
                    : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-900/8 dark:border-slate-600 dark:focus:border-slate-400",
              )}
            />
          ))}
        </div>

        {/* Error message */}
        {hasError && (
          <div className="mb-3 flex items-center justify-center gap-1.5">
            <span className="material-symbols-rounded text-[15px] text-red-500">error</span>
            <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Attempt warning */}
        {hasError && (
          <p className="mb-5 text-center text-[0.78rem] text-slate-400 dark:text-slate-500">
            You have a maximum of 5 attempts. After 5 failed attempts, you must wait 30 minutes to try again.
          </p>
        )}

        {/* Submit */}
        <button
          type="button"
          disabled={isSubmitting || !isFilled}
          onClick={handleSubmit}
          className={cn(submitBtnCls, "mt-2")}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
              Verifying…
            </span>
          ) : (
            <>
              Verify &amp; Continue
              <span className="material-symbols-rounded text-[18px]">check_circle</span>
            </>
          )}
        </button>

        {/* Resend */}
        <div className="mt-5 flex flex-col items-center gap-1">
          <p className="text-[0.85rem] text-slate-500 dark:text-slate-300">
            Didn't receive the code?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={cn(
                "text-[0.85rem] font-bold transition-colors",
                canResend
                  ? "cursor-pointer text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                  : "cursor-default text-slate-400 dark:text-slate-500",
              )}
            >
              Resend Code
            </button>
            {!canResend && (
              <span className="text-[0.82rem] text-slate-500 dark:text-slate-400">
                Resend in {formatTime(countdown)}
              </span>
            )}
          </div>
        </div>

        {/* Footer step indicator */}
        <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
          Security Verification Step 2/2
        </p>
      </div>
    </div>
  );
}
