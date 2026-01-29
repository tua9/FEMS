import HistoryDetailModal from '@/components/student/student-history/HistoryDetailModal';
import HistoryHeader from '@/components/student/student-history/HistoryHeader';
import HistoryList from '@/components/student/student-history/HistoryList';
import HistorySearchBar from '@/components/student/student-history/HistorySearchBar';
import HistoryTabs from '@/components/student/student-history/HistoryTabs';
import React, { useState } from 'react';


const MyHistory: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('BORROWING HISTORY');
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <HistoryHeader />

      <div className="space-y-8">
        <HistorySearchBar />
        <section className="glass-main p-8 rounded-[2.5rem] shadow-xl">
          <HistoryTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
          <HistoryList onItemClick={() => setShowDetails(true)} />
        </section>
      </div>

      <HistoryDetailModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
};

export default MyHistory;