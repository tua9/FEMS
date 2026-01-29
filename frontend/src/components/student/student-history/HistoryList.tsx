import React from 'react';
import HistoryItem from './HistoryItem';

const mockHistoryItems = [
    { name: 'MacBook Pro M1', id: 'FPT-LAP-082', trxId: '#TRX-99201-B', period: '12 Oct - 19 Oct 2024', status: 'Returned', img: 'https://picsum.photos/seed/lap/100/100' },
    { name: '4K Laser Projector', id: 'FPT-PJ-014', trxId: '#TRX-88432-I', period: '05 Oct - 06 Oct 2024', status: 'Resolved', img: 'https://picsum.photos/seed/pj/100/100' },
    { name: 'iPad Air 5th Gen', id: 'FPT-TAB-055', trxId: '#TRX-77102-B', period: '20 Sep - 25 Sep 2024', status: 'Returned', img: 'https://picsum.photos/seed/pad/100/100' },
];

interface HistoryListProps {
    onItemClick: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onItemClick }) => {
    return (
        <div className="space-y-4">
            {mockHistoryItems.map((item, index) => (
                <HistoryItem
                    key={index}
                    {...item}
                    onClick={onItemClick}
                />
            ))}
        </div>
    );
};

export default HistoryList;