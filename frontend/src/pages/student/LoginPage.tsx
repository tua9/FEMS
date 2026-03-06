import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="light flex min-h-screen items-center justify-center bg-white p-4" style={{ colorScheme: 'light' }}>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <h1 className="text-slate-900 text-4xl font-extrabold tracking-tight md:text-5xl">
            Login
          </h1>
          <p className="text-slate-500 mt-3 text-sm">
            Exclusive portal for FPT University students, faculty, and technical
            staff.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
