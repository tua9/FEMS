import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

// ── Validation schema ─────────────────────────────────────────────────────────

const signInSchema = z.object({
 username: z.string().min(1, "Username or Email không được để trống"),
 password: z.string().min(1, "Password không được để trống"),
 rememberMe: z.boolean().optional(),
});

const ROLE_ROUTES= {
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
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 fill="currentColor"
 />
 <path
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 fill="currentColor"
 />
 <path
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
 fill="currentColor"
 />
 <path
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 fill="currentColor"
 />
 </svg>
);

// ── Field label ───────────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
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

export function LoginForm({ className, ...props }) {
 const [rememberMe, setRememberMe] = useState(false);
 const [loginError, setLoginError] = useState(null);
 const [showPassword, setShowPassword] = useState(false);

 const {
 handleSubmit,
 register,
 formState: { errors, isSubmitting },
 } = useForm({
 resolver: zodResolver(signInSchema),
 defaultValues: { rememberMe: false },
 });

 const { signIn, signInWithGoogle } = useAuthStore();
 const navigate = useNavigate();

 const onSubmit = async (data) => {
 const { username, password } = data;
 setLoginError(null);
 try {
 await signIn(username, password);
 // Đọc role từ store sau khi fetchUserProfile hoàn tất
 const role = useAuthStore.getState().user?.role ?? "";
 navigate(ROLE_ROUTES[role] ?? "/");
 } catch {
 setLoginError("Incorrect username/email or password. Please try again.");
 }
 };

 const [googleError, setGoogleError] = useState(null);
 const [isGoogleLoading, setIsGoogleLoading] = useState(false);

 const handleGoogleLogin = useGoogleLogin({
 onSuccess: async ({ access_token }) => {
 setGoogleError(null);
 setIsGoogleLoading(true);
 try {
 await signInWithGoogle(access_token);
 const role = useAuthStore.getState().user?.role ?? "";
 navigate(ROLE_ROUTES[role] ?? "/");
 } catch (error) {
 const msg = error?.response?.data?.message;
 setGoogleError(msg || "Google login failed. Please try again.");
 } finally {
 setIsGoogleLoading(false);
 }
 },
 onError: () => setGoogleError("Google login failed. Please try again."),
 });

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
 <FieldLabel>Username or Email</FieldLabel>
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
 placeholder="Username or Email"
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
 : "Incorrect username/email or password. Please try again."}
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
 "bg-[#1E2B58] text-[0.9rem] font-semibold text-white",
 "shadow-[0_10px_25px_-5px_rgba(30,43,88,0.35)]",
 "transition-all duration-200 hover:bg-[#162044] active:scale-[0.99]",
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
 onClick={() => { setGoogleError(null); handleGoogleLogin(); }}
 disabled={isGoogleLoading}
 className={cn(
 "flex h-12 w-full items-center justify-center gap-2.5 rounded-xl",
 "border border-[#1E2B58]/20 bg-white text-[0.9rem] font-medium text-[#1E2B58]",
 "shadow-[0_2px_12px_-3px_rgba(30,43,88,0.08)]",
 "transition-all duration-150 hover:border-[#1E2B58]/40 hover:bg-[#1E2B58]/5",
 "active:scale-[0.99] disabled:opacity-60",
 "dark:border-slate-400/60 dark:bg-slate-800 dark:text-slate-100 dark:shadow-none",
 "dark:hover:border-slate-300 dark:hover:bg-slate-700/60",
 )}
 >
 {isGoogleLoading ? (
 <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
 ) : (
 <GoogleIcon />
 )}
 Login with Google
 </button>

 {/* Google error */}
 {googleError && (
 <span className="flex items-center gap-1.5 text-[0.75rem] font-medium text-red-500 dark:text-red-400">
 <span className="material-symbols-rounded text-[14px]">error</span>
 {googleError}
 </span>
 )}

 {/* Footer note */}
 <p className="pt-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
 Authorized Personnel Only
 </p>

 </form>
 </div>
 </div>
 );
}
