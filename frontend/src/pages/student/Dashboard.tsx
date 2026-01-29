import ActiveBorrowSection from '@/components/student/dashboard/ActiveBorrowSection';
import AvailableEquipmentSection from '@/components/student/dashboard/AvailableEquipmentSection';
import BorrowStatsCard from '@/components/student/dashboard/BorrowStatsCard';
import NotificationPanel from '@/components/student/dashboard/NotificationPanel';
import SearchBar from '@/components/student/dashboard/SearchBar';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 space-y-6">
        <NotificationPanel />
        <BorrowStatsCard />
      </aside>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <ActiveBorrowSection />
        <SearchBar />
        <AvailableEquipmentSection />
      </div>
    </div>
  );
};

export default Dashboard;