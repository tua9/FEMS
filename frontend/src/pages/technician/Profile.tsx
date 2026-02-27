import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - replace with real data from context/API
  const [profile, setProfile] = useState({
    name: 'John Technician',
    email: 'john.tech@fems.edu',
    phone: '+1 (555) 123-4567',
    employeeId: 'TECH-2024-001',
    department: 'Facilities Management',
    specialization: 'Electrical & Plumbing',
    joinDate: '2024-01-15',
  });

  const stats = {
    totalCompleted: 145,
    avgResponseTime: '2.5 hours',
    satisfactionRate: '98%',
    activeTasksCount: 8,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">
          My Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
          Manage your personal information and view your performance
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-main rounded-4xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-deep to-blue-600 flex items-center justify-center shadow-xl">
              <span className="material-symbols-outlined text-5xl text-white">
                person
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-navy-deep dark:text-white mb-1">
                {profile.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {profile.department}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/30">
                  Active
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Employee ID: {profile.employeeId}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">
              {isEditing ? 'close' : 'edit'}
            </span>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all"
              />
            ) : (
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {profile.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all"
              />
            ) : (
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {profile.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all"
              />
            ) : (
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {profile.phone}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Specialization
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all"
              />
            ) : (
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {profile.specialization}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Department
            </label>
            <p className="text-sm font-bold text-navy-deep dark:text-white">
              {profile.department}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
              Join Date
            </label>
            <p className="text-sm font-bold text-navy-deep dark:text-white">
              {new Date(profile.joinDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="pt-6 border-t border-white/20 dark:border-white/10">
            <button
              onClick={() => {
                setIsEditing(false);
                alert('Profile updated successfully!');
              }}
              className="w-full btn-navy-gradient text-white px-10 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl"
            >
              Save Changes
              <span className="material-symbols-outlined text-lg">save</span>
            </button>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="glass-main rounded-4xl p-8 shadow-2xl">
        <h3 className="text-xl font-extrabold text-navy-deep dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">analytics</span>
          Performance Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-green-500">
                check_circle
              </span>
              <span className="text-2xl font-black text-navy-deep dark:text-white">
                {stats.totalCompleted}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Tasks Completed
            </p>
          </div>

          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-blue-500">
                speed
              </span>
              <span className="text-2xl font-black text-navy-deep dark:text-white">
                {stats.avgResponseTime}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Avg Response
            </p>
          </div>

          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-yellow-500">
                star
              </span>
              <span className="text-2xl font-black text-navy-deep dark:text-white">
                {stats.satisfactionRate}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Satisfaction
            </p>
          </div>

          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-2xl text-purple-500">
                pending_actions
              </span>
              <span className="text-2xl font-black text-navy-deep dark:text-white">
                {stats.activeTasksCount}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Active Tasks
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-main rounded-4xl p-8 shadow-2xl">
        <h3 className="text-xl font-extrabold text-navy-deep dark:text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">settings</span>
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/technician/change-password')}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-sm text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">lock</span>
            Change Password
          </button>

          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-sm text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            Notification Settings
          </button>

          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-sm text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Download Report
          </button>

          <button
            onClick={() => alert('Feature coming soon!')}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-sm text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
