import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

// ── Validation schema ─────────────────────────────────────────────────────────

const signInSchema = z.object({
  username: z.string().min(1, "Username không được để trống"),
  password: z.string().min(1, "Password không được để trống"),
  rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const ROLE_ROUTES: Record<string, string> = {
  student: "/student/dashboard",
  lecturer: "/lecturer/dashboard",
  admin: "/admin/dashboard",
  technician: "/technician/dashboard",
};

// ── Google logo SVG ───────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
  >
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      fill="currentColor"
    />
  </svg>
);

// ── Field label ───────────────────────────────────────────────────────────────

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-200">
    {children}
  </label>
);

// ── Shared input base className ───────────────────────────────────────────────

const inputCls =
  "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-[0.9rem] font-normal text-slate-700 placeholder:text-slate-300 outline-none transition-all duration-150 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:shadow-none";

const inputNormal =
  "border-slate-300 focus:border-slate-400/50 focus:ring-2 focus:ring-slate-900/8 dark:border-slate-500 dark:focus:border-slate-500/60 dark:focus:ring-white/8";

const inputError =
  "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-500/15 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/15";

// ── LoginForm ─────────────────────────────────────────────────────────────────

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { rememberMe: false },
  });

  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    setLoginError(null);
    try {
      await signIn(username, password);
      // Đọc role từ store sau khi fetchUserProfile hoàn tất
      const role = useAuthStore.getState().user?.role ?? "";
      navigate(ROLE_ROUTES[role] ?? "/");
    } catch {
      setLoginError("Incorrect username or password. Please try again.");
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* ── Card ── */}
      <div
        className={cn(
          "w-full rounded-[2.5rem] border border-white/40 bg-white/75 p-8 backdrop-blur-xl",
          "shadow-[0_24px_70px_-8px_rgba(0,0,0,0.26)] dark:shadow-[0_24px_70px_-8px_rgba(0,0,0,0.82)]",
          "dark:border-slate-600/50 dark:bg-slate-800/90 md:p-12",
        )}
      >
        {/* ── Top fingerprint icon ── */}
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm dark:border-slate-600/50 dark:bg-slate-900">
          <span className="material-symbols-rounded text-2xl text-slate-400">
            fingerprint
          </span>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Username */}
          <div className="flex flex-col gap-2">
            <FieldLabel>Username</FieldLabel>
            <div className="relative">
              <span
                className={cn(
                  "material-symbols-rounded absolute top-1/2 left-3.5 -translate-y-1/2 select-none text-[18px] transition-colors duration-150",
                  errors.username || loginError
                    ? "text-red-400 dark:text-red-500"
                    : "text-slate-300 dark:text-slate-600",
                )}
              >
                account_circle
              </span>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                {...register("username", {
                  onChange: () => { if (loginError) setLoginError(null); },
                })}
                className={cn(
                  inputCls,
                  errors.username || loginError ? inputError : inputNormal,
                )}
              />
            </div>
            {errors.username && (
              <span className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] font-medium text-red-500 dark:text-red-400">
                <span className="material-symbols-rounded text-[14px]">error</span>
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel>Password</FieldLabel>
              <Link
                to="/forgot-password"
                className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span
                className={cn(
                  "material-symbols-rounded absolute top-1/2 left-3.5 -translate-y-1/2 select-none text-[18px] transition-colors duration-150",
                  errors.password || loginError
                    ? "text-red-400 dark:text-red-500"
                    : "text-slate-300 dark:text-slate-600",
                )}
              >
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                {...register("password", {
                  onChange: () => { if (loginError) setLoginError(null); },
                })}
                className={cn(
                  inputCls,
                  "pr-11",
                  errors.password || loginError ? inputError : inputNormal,
                )}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-300 transition hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-rounded select-none text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {/* Inline error */}
            {(errors.password || loginError) && (
              <span className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] font-medium text-red-500 dark:text-red-400">
                <span className="material-symbols-rounded text-[14px]">error</span>
                {errors.password
                  ? errors.password.message
                  : "Incorrect username or password. Please try again."}
              </span>
            )}
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <span
              className={cn(
                "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                rememberMe
                  ? "border-slate-800 bg-slate-800 dark:border-slate-500 dark:bg-slate-500"
                  : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800",
              )}
            >
              {rememberMe && (
                <span className="material-symbols-rounded text-[11px] font-bold text-white">
                  check
                </span>
              )}
            </span>
            <span className="select-none text-[0.8125rem] font-normal text-slate-500 dark:text-slate-400">
              Remember me
            </span>
          </label>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-xl",
              "bg-slate-900 text-[0.9rem] font-semibold text-white",
              "shadow-[0_10px_25px_-5px_rgba(30,41,59,0.3)]",
              "transition-all duration-200 hover:bg-slate-800 active:scale-[0.99]",
              "disabled:opacity-60",
              "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
              "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)]",
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                Signing in…
              </span>
            ) : (
              <>
                Login with FPT Account
                <span className="material-symbols-rounded text-[18px]">
                  arrow_forward
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/60" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/60" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2.5 rounded-xl",
              "border border-slate-300 bg-white text-[0.9rem] font-medium text-slate-700",
              "shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)]",
              "transition-all duration-150 hover:border-slate-300 hover:bg-slate-50",
              "active:scale-[0.99]",
              "dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300 dark:shadow-none",
              "dark:hover:border-slate-500 dark:hover:bg-slate-700",
            )}
          >
            <GoogleIcon />
            Login with Google
          </button>

          {/* Footer note */}
          <p className="pt-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Authorized Personnel Only
          </p>

        </form>
      </div>
    </div>
  );
}

