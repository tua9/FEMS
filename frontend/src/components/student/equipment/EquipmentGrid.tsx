import React from 'react';
import EquipmentItem from './EquipmentItem';

const EquipmentGrid: React.FC<{ activeCategory: string }> = ({ activeCategory }) => {
    // Trong tương lai: filter theo activeCategory + fetch từ API
    const mockItems = [
        { name: 'MacBook Pro M2', tag: 'FPT-LAP-082', status: 'Available', icon: 'laptop_mac' },
        { name: '4K Laser Projector', tag: 'FPT-PJ-014', status: 'Available', icon: 'camera' },
        { name: 'iPad Air 5th Gen', tag: 'FPT-TAB-055', status: 'In Use', icon: 'tablet_mac' },
        { name: 'UltraWide Monitor', tag: 'FPT-MN-033', status: 'Available', icon: 'desktop_windows' },
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-extrabold text-xl text-[var(--navy-deep)] dark:text-white">
                    Available Equipment
                </h2>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Showing 24 Items
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockItems.map((item, index) => (
                    <EquipmentItem
                        key={index}
                        name={item.name}
                        tag={item.tag}
                        status={item.status}
                        icon={item.icon}
                    />
                ))}
            </div>
        </section>
    );
};

export default EquipmentGrid;