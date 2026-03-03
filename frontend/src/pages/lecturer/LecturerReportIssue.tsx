
import React from 'react';

const CATEGORIES = [
  { id: 'elec', name: 'Electrical', icon: 'bolt' },
  { id: 'plumb', name: 'Plumbing', icon: 'water_drop' },
  { id: 'it', name: 'IT Device', icon: 'terminal' },
  { id: 'furn', name: 'Furniture', icon: 'chair' },
  { id: 'other', name: 'Other', icon: 'more_horiz' },
];

const LecturerReportIssue: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Report submitted successfully!');
  };

  return (
    <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8 text-left">
        <h2 className="text-4xl font-extrabold text-[#1E2B58] dark:text-white mb-2 tracking-tight">Report an Issue</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Submit a maintenance request for university facilities or equipment.</p>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between rounded-4xl gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1E2B58]/5 dark:bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#1E2B58] dark:text-white">qr_code_scanner</span>
          </div>
          <div>
            <h3 className="font-bold text-[#1E2B58] dark:text-white">Quick Scan Report</h3>
            <p className="text-xs text-slate-500">Scan QR code on equipment to report instantly</p>
          </div>
        </div>
        <button className="navy-gradient-btn px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
          Scan QR Code
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-grow h-px bg-slate-200 dark:bg-white/10"></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or create manual request</span>
        <div className="flex-grow h-px bg-slate-200 dark:bg-white/10"></div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 lg:p-10 space-y-10 rounded-4xl">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-[0.15em]">1. Select Issue Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <label key={cat.id} className="cursor-pointer group">
                <input type="radio" name="category" className="hidden peer" defaultChecked={cat.id === 'elec'} />
                <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 transition-all aspect-square peer-checked:bg-white peer-checked:border-[#1E2B58] dark:peer-checked:border-accent-blue peer-checked:shadow-lg peer-checked:scale-[1.02]">
                  <span className="material-symbols-outlined text-slate-500 peer-checked:text-[#1E2B58] dark:peer-checked:text-accent-blue text-3xl">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 peer-checked:text-[#1E2B58] dark:peer-checked:text-accent-blue">
                    {cat.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.15em]">2. Incident Location</h3>
          <div className="relative">
            <select className="w-full h-14 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl pl-12 pr-12 text-[#1E2B58] dark:text-white font-medium focus:ring-2 focus:ring-[#1E2B58]/10 outline-none appearance-none">
              <option>Search or select location (e.g. Block A, Room 402)</option>
              <option>Block A - Room 402</option>
              <option>Block B - Cafeteria</option>
              <option>Library - Floor 2</option>
            </select>
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">location_on</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.15em]">3. Issue Description</h3>
          <textarea
            className="w-full h-36 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl p-6 text-[#1E2B58] dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E2B58]/10 outline-none resize-none"
            placeholder="Please provide specific details about the issue..."
          />
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-[0.15em]">4. Upload Evidence</h3>
          <div className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-3xl flex flex-col items-center justify-center gap-3 bg-white/20 hover:bg-white/30 cursor-pointer group transition-all">
            <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#1E2B58] text-2xl">photo_camera</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">Drag and drop photos here</p>
              <p className="text-[10px] text-slate-400 uppercase mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <button className="navy-gradient-btn w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
          Submit Report
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </form>
    </div>
  );
};

export default LecturerReportIssue;
