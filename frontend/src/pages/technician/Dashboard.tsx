import DeviceHealth from '../../components/technician/dashboard/DeviceHealth';
import StatsOverview from '../../components/technician/dashboard/StatsOverview';
import TaskQueue from '../../components/technician/dashboard/TaskQueue';
import TicketPipeline from '../../components/technician/dashboard/TicketPipeline';
import React from 'react';

const Dashboard: React.FC = () => {

  return (
    <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">
            System Status
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Real-time facility maintenance and ticket management
          </p>
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