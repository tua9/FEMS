import DeviceHealth from '../../components/technician/dashboard/DeviceHealth';
import StatsOverview from '../../components/technician/dashboard/StatsOverview';
import TaskQueue from '../../components/technician/dashboard/TaskQueue';
import TicketPipeline from '../../components/technician/dashboard/TicketPipeline';
import React from 'react';
import { PageShell, AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/motion';

const Dashboard: React.FC = () => {
  return (
    <PageShell
      title="System Status"
      subtitle="Real-time facility maintenance and ticket management"
      topPadding="pt-32"
      className="pb-16 px-6"
    >
      {/* Stats Cards */}
      <AnimatedList className="mb-10">
        <AnimatedListItem>
          <StatsOverview />
        </AnimatedListItem>
      </AnimatedList>

      {/* Ticket Pipeline + Device Health */}
      <AnimatedSection variant="fade" delay={0.1} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        <div className="lg:col-span-3">
          <TicketPipeline />
        </div>
        <div className="lg:col-span-2">
          <DeviceHealth />
        </div>
      </AnimatedSection>

      {/* Active Work Orders */}
      <AnimatedSection variant="slide-up" delay={0.15}>
        <TaskQueue />
      </AnimatedSection>
    </PageShell>
  );
};

export default Dashboard;