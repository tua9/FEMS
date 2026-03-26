import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';

const TechnicianEquipment: React.FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-[#e0eafc] to-white dark:from-[#0f172a] dark:to-[#1a2332] pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Equipment Management"
                    subtitle="View and manage all facility equipment and assets."
                />
                <div className="mt-8 text-center text-slate-500">
                    <p>Equipment management feature coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default TechnicianEquipment;
