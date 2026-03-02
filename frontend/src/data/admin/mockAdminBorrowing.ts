import { BorrowRecord } from '../../types/admin.types';

export const mockBorrowingList: BorrowRecord[] = [
    {
        id: 'BOR-001',
        borrowerId: 'STU-88210',
        borrowerName: 'Sarah Jenkins',
        borrowerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcggs7eAYT2sZhh9PUUg92V8HXIIxc0jDm5T-fbIxRUndvYPXR-KaiMKom4de_HNUf5iT0-HXrSSkKxMtksiCqeXY_XGF1VWVo0aCv_toMt8A72BLQ4v8_rNOTrcGhPwgm0qltaPl1Snkr87WwGfeaxWAzmp68qbD9ReQq-riFao0D-mhrHJ2uTB-RSHtnfotQfepINcMPrQjS61Bci7WRtS9u43hLtR7cob_7vOg1HZm3AvAwVWqo8McXaZGEZ3JKnAWygJOar1AQ',
        equipmentId: 'ASSET-78210',
        equipmentName: 'MacBook Pro M3',
        dueDate: 'Oct 24, 2024',
        status: 'Pending',
        isDueTodayOrTomorrow: true,
    },
    {
        id: 'BOR-002',
        borrowerId: 'STU-44291',
        borrowerName: 'Michael Chen',
        borrowerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcggs7eAYT2sZhh9PUUg92V8HXIIxc0jDm5T-fbIxRUndvYPXR-KaiMKom4de_HNUf5iT0-HXrSSkKxMtksiCqeXY_XGF1VWVo0aCv_toMt8A72BLQ4v8_rNOTrcGhPwgm0qltaPl1Snkr87WwGfeaxWAzmp68qbD9ReQq-riFao0D-mhrHJ2uTB-RSHtnfotQfepINcMPrQjS61Bci7WRtS9u43hLtR7cob_7vOg1HZm3AvAwVWqo8McXaZGEZ3JKnAWygJOar1AQ',
        equipmentId: 'ASSET-44291',
        equipmentName: 'Canon EOS R6',
        dueDate: 'Oct 20, 2024',
        status: 'Approved',
        isDueTodayOrTomorrow: true,
    },
    {
        id: 'BOR-003',
        borrowerId: 'STU-12003',
        borrowerName: 'Emma Watson',
        borrowerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcggs7eAYT2sZhh9PUUg92V8HXIIxc0jDm5T-fbIxRUndvYPXR-KaiMKom4de_HNUf5iT0-HXrSSkKxMtksiCqeXY_XGF1VWVo0aCv_toMt8A72BLQ4v8_rNOTrcGhPwgm0qltaPl1Snkr87WwGfeaxWAzmp68qbD9ReQq-riFao0D-mhrHJ2uTB-RSHtnfotQfepINcMPrQjS61Bci7WRtS9u43hLtR7cob_7vOg1HZm3AvAwVWqo8McXaZGEZ3JKnAWygJOar1AQ',
        equipmentId: 'ASSET-33819',
        equipmentName: 'iPad Pro 12.9"',
        dueDate: 'Oct 15, 2024',
        status: 'Overdue',
        isDueTodayOrTomorrow: true,
    },
];
