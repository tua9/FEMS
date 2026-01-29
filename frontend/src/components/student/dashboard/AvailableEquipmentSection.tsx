import React from 'react';
import { Link } from 'react-router-dom';
import EquipmentCard from './EquipmentCard';

const AvailableEquipmentSection: React.FC = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="font-bold text-xl text-[var(--navy-deep)] dark:text-white">Available Equipment</h2>
                <Link
                    to="/equipment"
                    className="text-navy-deep dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline"
                >
                    View All
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <EquipmentCard
                    name="HDMI Cable (3m)"
                    tag="FPT-ACC-102 • Room 402"
                    img="https://picsum.photos/seed/hdmi/400/300"
                    available
                />
                <EquipmentCard
                    name="Panasonic Projector"
                    tag="FPT-PJ-045 • Room 405"
                    img="https://picsum.photos/seed/projector/400/300"
                    available
                />
                <EquipmentCard
                    name='Dell Monitor 27"'
                    tag="FPT-MN-099 • Room 301"
                    img="https://picsum.photos/seed/monitor/400/300"
                />
            </div>
        </section>
    );
};

export default AvailableEquipmentSection;