import { useState } from "react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Xử lý login
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Login
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Exclusive portal for FPT University students, faculty, and technical staff.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-[var(--radius)] border border-border shadow-lg p-8 md:p-10">
          {/* Icon header (giữ nguyên, đã centered) */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-primary">
                fingerprint
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Select Role - không có icon, giữ nguyên */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm appearance-none cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty / Lecturer</option>
                <option value="tech-staff">Technical Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-muted-foreground text-xl pointer-events-none">
                  account_circle
                </span>
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-muted-foreground text-xl pointer-events-none">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-sm"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-muted-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Login with FPT Account</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full bg-background border border-input hover:bg-accent hover:text-accent-foreground text-foreground font-medium py-3.5 rounded-md transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              {/* SVG Google giữ nguyên */}
              <svg className="w-5 h-5" viewBox="0 0 24 24"> {/* ... path Google */} </svg>
              <span>Login with Google</span>
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}