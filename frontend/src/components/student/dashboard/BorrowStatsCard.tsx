import React from 'react';

const BorrowStatsCard: React.FC = () => {
    return (
        <div className="btn-navy-gradient p-6 rounded-3xl text-white relative overflow-hidden group shadow-lg">
            <div className="relative z-10">
                <p className="text-blue-200 text-xs font-medium mb-1">Total Borrows</p>
                <h3 className="text-3xl font-bold mb-4">
                    12 <span className="text-sm font-normal text-blue-100">Items</span>
                </h3>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 w-3/4"></div>
                </div>
                <p className="text-[10px] mt-2 text-blue-100">75% of your semester quota used</p>
            </div>

            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                inventory_2
            </span>
        </div>
    );
};

export default BorrowStatsCard;