import { LoginForm } from "@/components/auth/login-form";
import DarkModeToggle from "@/components/shared/navbar/DarkModeToggle";
import Footer from "@/components/common/Footer";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#e0eafc] dark:bg-[#0f172a]">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-black/8 dark:ring-white/10">
            <img src="/logo1.png" alt="F-EMS Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-[0.9375rem] font-bold tracking-tight text-slate-800 dark:text-white">
            F-EMS
            <span className="ml-1 text-sm font-normal text-slate-400 dark:text-slate-500">| FPT University</span>
          </span>
        </div>

        {/* Right side: dark mode toggle + report issue */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <a
            href="/report-issue"
            className="text-[0.85rem] font-extrabold text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            Report Issue
          </a>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex flex-1 items-center justify-center px-4 pb-8 pt-10 sm:pt-16">
        <div className="flex w-full max-w-md -translate-y-12 flex-col items-center">

          {/* Heading */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-navi dark:text-white md:text-5xl">
            Login
          </h1>
          <p className="mx-auto mb-10 max-w-md text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Exclusive portal for FPT University students, faculty, and technical staff.
          </p>

          {/* Form card */}
          <LoginForm className="w-full" />

        </div>
      </main>

      <Footer role="auth" />

    </div>
  );
}
