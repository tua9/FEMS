import DeviceHealth from '../../components/technician/dashboard/DeviceHealth';
import StatsOverview from '../../components/technician/dashboard/StatsOverview';
import TaskQueue from '../../components/technician/dashboard/TaskQueue';
import TicketPipeline from '../../components/technician/dashboard/TicketPipeline';
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">
            System Status
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Real-time facility maintenance and ticket management
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search system assets..."
            className="w-full pl-10 pr-4 py-3 bg-white/40 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1A2B56]/20 placeholder-slate-500 backdrop-blur-md outline-none"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
            search
          </span>
        </div>
      </section>

      {/* Stats Cards */}
      <section>
        <StatsOverview />
      </section>

      {/* Ticket Pipeline + Device Health */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TicketPipeline />
        </div>
        <div className="lg:col-span-2">
          <DeviceHealth />
        </div>
      </section>

      {/* Active Work Orders */}
      <section>
        <TaskQueue />
      </section>
    </main>
  );
};

export default Dashboard;