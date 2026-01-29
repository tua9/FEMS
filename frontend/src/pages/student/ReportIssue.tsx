import CategorySelector from '@/components/student/report-issue/CategorySelector';
import FormActions from '@/components/student/report-issue/FormActions';
import IssueFormFields from '@/components/student/report-issue/IssueFormFields';
import LocationInfo from '@/components/student/report-issue/LocationInfo';
import ReportHeader from '@/components/student/report-issue/ReportHeader';
import React, { useState } from 'react';


const ReportIssue: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Electrical');

  const categories = [
    { id: 'Electrical', icon: 'electric_bolt' },
    { id: 'Plumbing', icon: 'water_drop' },
    { id: 'Maintenance', icon: 'handyman' },
    { id: 'Furniture', icon: 'chair' },
    { id: 'Safety', icon: 'warning' },
    { id: 'Other', icon: 'grid_view' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-12">
      <ReportHeader />

      <section className="glass-main rounded-4xl p-6 md:p-10 shadow-2xl">
        <form className="space-y-8">
          <LocationInfo />

          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <IssueFormFields />

          <FormActions />
        </form>
      </section>
    </div>
  );
};

export default ReportIssue;