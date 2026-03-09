import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ── Validation schema ─────────────────────────────────────────────────────────

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

// ── Shared styles ─────────────────────────────────────────────────────────────

const cardCls = cn(
  "w-full rounded-[2.5rem] border border-white/40 bg-white/75 p-8 backdrop-blur-xl",
  "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.65)]",
  "dark:border-slate-600/50 dark:bg-slate-800/90 md:p-12",
);

const inputCls =
  "h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-[0.9rem] font-normal text-slate-700 placeholder:text-slate-300 outline-none transition-all duration-150 focus:border-slate-400/50 focus:ring-2 focus:ring-slate-900/8 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.06)] dark:border-slate-500 dark:bg-slate-900/60 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-slate-500/60 dark:focus:ring-white/8 dark:shadow-none";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
    {children}
  </label>
);

// ── ForgotPasswordForm ────────────────────────────────────────────────────────

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  onSent: (email: string) => Promise<void>;
  onBack: () => void;
}

export function ForgotPasswordForm({
  onSent,
  onBack,
  className,
  ...props
}: ForgotPasswordFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    mode: "onTouched",
  });

  const onSubmit = async ({ email }: ForgotFormValues) => {
    await onSent(email);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cardCls}>
        {/* Key icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm dark:border-slate-600/50 dark:bg-slate-900">
          <span className="material-symbols-rounded text-2xl text-slate-400">key</span>
        </div>

        {/* Description */}
        <p className="mx-auto mb-6 max-w-xs text-center text-sm text-slate-500 dark:text-slate-400">
          Enter your university email and we will send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <FieldLabel>University Email</FieldLabel>
            <div className="relative">
              <span className="material-symbols-rounded absolute top-1/2 left-3.5 -translate-y-1/2 select-none text-[18px] text-slate-300 dark:text-slate-600">
                mail
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. name@fpt.edu.vn"
                {...register("email")}
                className={cn(
                  inputCls,
                  errors.email && "border-red-400 focus:border-red-400 dark:border-red-500",
                )}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[14px] text-red-500">error</span>
                <p className="text-[0.775rem] font-medium text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-xl",
              "bg-slate-900 text-[0.9rem] font-semibold text-white",
              "shadow-[0_10px_25px_-5px_rgba(30,41,59,0.3)]",
              "transition-all duration-200 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60",
              "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
              "dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)]",
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                Sending…
              </span>
            ) : (
              <>
                Send
                <span className="material-symbols-rounded text-[18px]">send</span>
              </>
            )}
          </button>

          {/* Back to login */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span className="material-symbols-rounded text-[16px]">arrow_back</span>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
