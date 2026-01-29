
import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">Student Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Manage your personal information and account security.</p>
      </div>

      <div className="glass-main rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        <div className="lg:w-1/3 p-12 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-white/30 dark:border-white/5">
          <div className="relative group mb-8">
            <div className="w-48 h-48 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-2xl bg-[#D4C3A3]">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEN1b793kY1IzuwH6AhBg4THRAhN-JBovYTje7ZGjazVNDtsu72U8fdYKy3MV0FmBn6PnnfScPedB4SaDBi6FfEqWdfSW7-0juht7C7_0pbGixLlk-XDsLVX61ZkXNWPVX_EBgSECgI4cbyyg2m3-VMBFi6rGN6wtHQu3wpjb-5L0kc70b0oGrsm0Sr625B7i9oTGud7IUOqDOZD140FWMyoc2eBRCRxaPP5DvbeELgk2tzfSJVM6uVR6Jd17tE4lsy3IjlCo_u2PF"
              />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-navy-deep dark:text-white">Nguyen Van A</h2>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">SE123456</p>
          <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Active Student
          </div>
        </div>

        <div className="lg:w-2/3 p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <InfoField label="Email Address" value="angvse123456@fpt.edu.vn" icon="mail" />
            <InfoField label="Major" value="Software Engineering" icon="school" />
            <InfoField label="Phone Number" value="+84 987 654 321" icon="phone" />
            <InfoField label="Campus" value="Da Nang" icon="location_city" />
            <InfoField label="Date of Birth" value="January 15, 2002" icon="calendar_today" />
            <InfoField label="Citizenship ID" value="048202001234" icon="badge" />
          </div>
          <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/change-password"
              className="w-full sm:w-auto btn-navy-gradient text-white px-10 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg"
            >
              Change Password
              <span className="material-symbols-outlined text-lg">key</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </label>
    <div className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 backdrop-blur-md">
      {value}
    </div>
  </div>
);

export default Profile;
