import React, { useState } from "react";
import { X, Save, Phone, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileEditModalProps {
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ onClose }) => {
  const { user, updateProfile, loading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await updateProfile(formData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="extreme-glass animate-in zoom-in-95 relative w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl shadow-[#1E2B58]/30 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-2xl text-[#1E2B58]/40 transition hover:bg-[#1E2B58]/10 hover:text-[#1E2B58] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#1E2B58]/[0.06] px-4 py-1.5 dark:bg-white/10">
            <span className="h-2 w-2 rounded-full bg-[#1E2B58] dark:bg-blue-400" />
            <span className="text-[0.625rem] font-black tracking-widest text-[#1E2B58] uppercase dark:text-blue-400">
              Account Settings
            </span>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-[#1E2B58] dark:text-white">
            Edit Contact Info
          </h3>
          <p className="mt-1.5 text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
            Update your email address and phone number.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[0.6875rem] font-black tracking-widest text-[#1E2B58]/60 uppercase dark:text-white/50">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="your-email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#1E2B58]/[0.08] bg-white/50 px-5 py-4 text-sm font-bold text-[#1E2B58] outline-none transition-all focus:border-[#1E2B58]/20 focus:ring-4 focus:ring-[#1E2B58]/5 dark:border-white/10 dark:bg-slate-800/40 dark:text-white dark:focus:ring-white/5"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[0.6875rem] font-black tracking-widest text-[#1E2B58]/60 uppercase dark:text-white/50">
              <Phone className="h-3.5 w-3.5" />
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="09xx xxx xxx"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#1E2B58]/[0.08] bg-white/50 px-5 py-4 text-sm font-bold text-[#1E2B58] outline-none transition-all focus:border-[#1E2B58]/20 focus:ring-4 focus:ring-[#1E2B58]/5 dark:border-white/10 dark:bg-slate-800/40 dark:text-white dark:focus:ring-white/5"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-3 text-xs font-bold text-red-500">
              <X className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-[1.25rem] bg-[#1E2B58]/[0.06] py-4 text-[0.8125rem] font-black tracking-widest text-[#1E2B58] uppercase transition-all hover:bg-[#1E2B58]/10 active:scale-[0.98] disabled:opacity-50 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group flex flex-[2] items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-4 text-[0.8125rem] font-black tracking-widest text-white uppercase shadow-xl shadow-[#1E2B58]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-blue-600 dark:shadow-blue-500/20"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <>
                  Save Changes <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
