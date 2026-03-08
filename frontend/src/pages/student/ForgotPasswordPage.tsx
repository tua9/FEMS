import { useState } from "react";
import { Link, useNavigate } from "react-router";
import DarkModeToggle from "@/components/shared/navbar/DarkModeToggle";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { OtpVerificationForm } from "@/components/auth/otp-verification-form";
import { SetNewPasswordForm } from "@/components/auth/set-new-password-form";

// ── Steps ─────────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "set-password" | "done";

// ── Page headings per step ────────────────────────────────────────────────────

const HEADINGS: Record<Step, string> = {
  email: "Forgot Password",
  otp: "Verification Code",
  "set-password": "Set New Password",
  done: "All Done!",
};

// ── ForgotPasswordPage ────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // ── Handlers ────────────────────────────────────────────────────────────

  /** Step 1 → 2: email submitted */
  const handleSent = async (submittedEmail: string) => {
    // TODO: call real "send OTP" API here
    await new Promise((r) => setTimeout(r, 800));
    setEmail(submittedEmail);
    setStep("otp");
  };

  /** Step 2 → 3 or error: OTP verified */
  const handleVerified = async (code: string): Promise<{ success: boolean }> => {
    // TODO: call real "verify OTP" API here — return { success: false } on wrong code
    await new Promise((r) => setTimeout(r, 800));
    const isCorrect = code === "123456"; // placeholder: accept "123456"
    if (isCorrect) setStep("set-password");
    return { success: isCorrect };
  };

  /** Step 3 done: password reset success — modal inside SetNewPasswordForm handles redirect */
  const handlePasswordSet = () => {
    // no-op: PasswordResetSuccessModal auto-redirects to /login
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#e0eafc] dark:bg-[#0f172a]">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5">
        {/* Logo */}
        <Link to="/login" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-black/8 dark:ring-white/10">
            <img src="/logo1.png" alt="F-EMS Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-[0.9375rem] font-bold tracking-tight text-slate-800 dark:text-white">
            F-EMS
            <span className="ml-1 text-sm font-normal text-slate-400 dark:text-slate-500">| FPT University</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <a
            href="#"
            className="text-[0.85rem] font-medium text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            Report Issue
          </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-10 sm:pt-16">
        <div className="flex w-full max-w-md -translate-y-6 flex-col items-center">

          {/* Heading — hidden for OTP/set-password since they have their own in-card heading */}
          {step === "email" && (
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              {HEADINGS[step]}
            </h1>
          )}

          {/* ── Step: Email ── */}
          {step === "email" && (
            <ForgotPasswordForm
              className="w-full"
              onSent={handleSent}
              onBack={() => navigate("/login")}
            />
          )}

          {/* ── Step: OTP ── */}
          {step === "otp" && (
            <OtpVerificationForm
              className="w-full"
              email={email}
              onVerified={handleVerified}
              onBack={() => setStep("email")}
            />
          )}

          {/* ── Step: Set new password ── */}
          {step === "set-password" && (
            <SetNewPasswordForm
              className="w-full"
              onSuccess={handlePasswordSet}
            />
          )}

        </div>
      </main>

    </div>
  );
}
