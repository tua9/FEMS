import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import LecturerNavbar from '../../components/lecturer/navbar/LecturerNavbar';

// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw: string): { level: number; label: string; color: string } {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8)            score++;
    if (/[A-Z]/.test(pw))          score++;
    if (/[0-9]/.test(pw))          score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;
    const levels = [
        { level: 1, label: 'Weak',   color: 'bg-red-400'    },
        { level: 2, label: 'Fair',   color: 'bg-amber-400'  },
        { level: 3, label: 'Good',   color: 'bg-blue-400'   },
        { level: 4, label: 'Strong', color: 'bg-emerald-500' },
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
    id, label, value, onChange, placeholder, error, hint, autoComplete = 'new-password',
}) => {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-[0.6875rem] font-black uppercase tracking-[0.15em] text-[#1E2B58]/50 dark:text-white/50">
                {label}
            </label>
            <div className={`flex items-center glass-card !rounded-2xl overflow-hidden border-2 transition-colors ${
                error
                    ? '!border-red-400 dark:!border-red-500'
                    : 'border-transparent focus-within:!border-[#1E2B58]/25 dark:focus-within:!border-white/20'
            }`}>
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="flex-1 bg-transparent px-5 py-4 text-[0.875rem] font-semibold text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none"
                />
                <button
                    type="button"
                    onClick={() => setShow(p => !p)}
                    className="px-4 text-[#1E2B58]/30 dark:text-white/30 hover:text-[#1E2B58]/70 dark:hover:text-white/70 transition-colors"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-red-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
            )}
            {hint && !error && (
                <p className="text-[0.75rem] text-[#1E2B58]/40 dark:text-white/40 font-medium">{hint}</p>
            )}
        </div>
    );
};

// ─── LecturerChangePassword ───────────────────────────────────────────────────
const LecturerChangePassword: React.FC = () => {
    const navigate = useNavigate();

    const [current,  setCurrent]  = useState('');
    const [next,     setNext]     = useState('');
    const [confirm,  setConfirm]  = useState('');
    const [errors,   setErrors]   = useState<Record<string, string>>({});
    const [success,  setSuccess]  = useState(false);
    const [loading,  setLoading]  = useState(false);

    const strength = getStrength(next);

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!current)          errs.current = 'Current password is required.';
        if (!next)             errs.next    = 'New password is required.';
        else if (next.length < 8)           errs.next = 'Must be at least 8 characters.';
        else if (!/[A-Z]/.test(next))       errs.next = 'Must contain at least one uppercase letter.';
        else if (!/[0-9]/.test(next))       errs.next = 'Must contain at least one number.';
        if (!confirm)          errs.confirm = 'Please confirm your new password.';
        else if (next !== confirm)          errs.confirm = 'Passwords do not match.';
        if (current && next && current === next) errs.next = 'New password must be different from current.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-[#e0eafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
                <LecturerNavbar />
                <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-lg mx-auto flex-1 flex flex-col justify-center">
                    <div className="extreme-glass rounded-[2rem] p-12 text-center shadow-2xl shadow-[#1E2B58]/8">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#1E2B58] dark:text-white mb-2">
                            Password Updated!
                        </h2>
                        <p className="text-sm text-[#1E2B58]/55 dark:text-white/50 mb-8 font-medium">
                            Your password has been changed successfully. You can now log in with your new password.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/lecturer/profile')}
                                className="w-full bg-[#1E2B58] text-white px-8 py-3.5 rounded-2xl font-extrabold text-[0.875rem] hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
                            >
                                Back to Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/lecturer/dashboard')}
                                className="w-full glass-card !rounded-2xl px-8 py-3.5 font-bold text-[0.875rem] text-[#1E2B58]/70 dark:text-white/70 hover:opacity-80 transition-opacity"
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
        <div className="min-h-screen w-full flex flex-col bg-[#e0eafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <LecturerNavbar />

            <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-xl mx-auto flex-1 flex flex-col">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate('/lecturer/profile')}
                    className="flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Profile
                </button>

                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-[2.25rem] font-extrabold text-[#1E2B58] dark:text-white leading-none tracking-tight">
                        Change Password
                    </h1>
                    <p className="mt-2 text-[#1E2B58]/55 dark:text-white/50 text-sm font-medium">
                        Keep your account secure by using a strong password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="extreme-glass rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-[#1E2B58]/8 space-y-7">

                        {/* Security badge */}
                        <div className="flex items-center gap-3 p-4 bg-[#1E2B58]/[0.04] dark:bg-white/[0.04] rounded-2xl">
                            <div className="w-9 h-9 rounded-xl bg-[#1E2B58]/[0.08] dark:bg-white/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4.5 h-4.5 text-[#1E2B58] dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[0.8125rem] font-bold text-[#1E2B58] dark:text-white">Security Tip</p>
                                <p className="text-[0.75rem] text-[#1E2B58]/50 dark:text-white/50 mt-0.5">
                                    Use 8+ characters with uppercase, numbers & symbols.
                                </p>
                            </div>
                        </div>

                        <PasswordInput
                            id="current"
                            label="Current Password"
                            value={current}
                            onChange={v => { setCurrent(v); setErrors(e => ({ ...e, current: '' })); }}
                            placeholder="Enter current password"
                            error={errors.current}
                            autoComplete="current-password"
                        />

                        <div className="space-y-2">
                            <PasswordInput
                                id="new"
                                label="New Password"
                                value={next}
                                onChange={v => { setNext(v); setErrors(e => ({ ...e, next: '' })); }}
                                placeholder="Enter new password"
                                error={errors.next}
                                hint="At least 8 characters, 1 uppercase letter, 1 number."
                            />
                            {/* Strength meter */}
                            {next && (
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1 flex-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                                    i <= strength.level ? strength.color : 'bg-[#1E2B58]/10 dark:bg-white/10'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-[0.6875rem] font-black uppercase tracking-wider ${
                                        strength.level <= 1 ? 'text-red-400' :
                                        strength.level === 2 ? 'text-amber-400' :
                                        strength.level === 3 ? 'text-blue-400' : 'text-emerald-500'
                                    }`}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <PasswordInput
                            id="confirm"
                            label="Confirm New Password"
                            value={confirm}
                            onChange={v => { setConfirm(v); setErrors(e => ({ ...e, confirm: '' })); }}
                            placeholder="Re-enter new password"
                            error={errors.confirm}
                        />

                        {/* Requirements checklist */}
                        {next && (
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { label: '8+ characters',    ok: next.length >= 8               },
                                    { label: 'Uppercase letter', ok: /[A-Z]/.test(next)             },
                                    { label: 'Number',           ok: /[0-9]/.test(next)             },
                                    { label: 'Passwords match',  ok: !!confirm && next === confirm  },
                                ].map(r => (
                                    <div key={r.label} className={`flex items-center gap-1.5 text-[0.75rem] font-semibold ${
                                        r.ok ? 'text-emerald-500' : 'text-[#1E2B58]/40 dark:text-white/40'
                                    }`}>
                                        {r.ok
                                            ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            : <div className="w-3.5 h-3.5 rounded-full border-2 border-current shrink-0 opacity-40" />
                                        }
                                        {r.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1E2B58] text-white px-8 py-4 rounded-2xl font-extrabold text-[0.9375rem] hover:bg-[#1E2B58]/90 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2.5 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default LecturerChangePassword;
