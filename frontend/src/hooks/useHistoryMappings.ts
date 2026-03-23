import { useMemo } from 'react';
import { FileText, Laptop, AlertTriangle, Monitor, Cable, Router, Cpu, Mic, Camera, TabletSmartphone, MonitorCog } from 'lucide-react';
import type { ReportHistoryItem, ReportSeverity, ReportStatus } from '@/components/shared/history/ReportHistoryTable';
import type { BorrowHistoryItem, BorrowStatus } from '@/components/shared/history/BorrowHistoryTable';
import type { ApprovalHistoryItem } from '@/components/shared/history/ApprovalHistoryTable';
import type { BorrowRequestEquipment, BorrowRequestRoom, BorrowRequestUser } from '@/types/borrowRequest';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, any> = {
    'laptop':         Laptop,
    'pc_lab':         MonitorCog,
    'iot_kit':        Cpu,
    'tablet':         TabletSmartphone,
    'camera':         Camera,
    'audio':          Mic,
    'network':        Router,
    'cable':          Cable,
    'electrical':     AlertTriangle,
    'infrastructure': Monitor,
    'it_device':      Laptop,
    'other':          FileText,
};

const TYPE_LABEL: Record<string, string> = {
    'equipment':      'Equipment',
    'infrastructure': 'Infrastructure',
    'other':          'Other',
};

const TYPE_ICON: Record<string, any> = {
    'equipment':      Laptop,
    'infrastructure': AlertTriangle,
    'other':          FileText,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Maps raw store data into the display shapes used by the history tables.
 */
export function useHistoryMappings(
    myReports: any[] | null,
    borrowRequests: any[] | null,
    approvedByMe: any[]
) {
    const mappedReports = useMemo<ReportHistoryItem[]>(() => {
        if (!myReports) return [];

        return myReports.map((r: any) => {
            const room = (r.room_id && typeof r.room_id === 'object') ? r.room_id : null;
            const eq   = (r.equipment_id && typeof r.equipment_id === 'object') ? r.equipment_id : null;
            const locationLabel = room?.name || eq?.name || 'Unknown';
            const type = (r.type || 'other').toLowerCase();

            return {
                id:            `#${(r._id as string)?.substring(18).toUpperCase() || 'ID'}`,
                date:          r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
                category:      TYPE_LABEL[type] ?? 'Other',
                location:      locationLabel,
                block:         '-',
                severity:      (r.severity?.toUpperCase() as ReportSeverity) || 'MEDIUM',
                status:        ((r.status?.toUpperCase() || 'PENDING') as ReportStatus),
                icon:          TYPE_ICON[type] ?? FileText,
                description:   r.description,
                img:           r.img,
                decision_note: r.decision_note || undefined,
                original:      r,
            };
        });
    }, [myReports]);

    const mappedBorrow = useMemo<BorrowHistoryItem[]>(() => {
        if (!borrowRequests) return [];

        return borrowRequests.map(b => {
            const statusMap: Record<string, BorrowStatus> = {
                'pending':    'PENDING' as any,
                'approved':   'APPROVED' as any,
                'handed_over':'BORROWED',
                'returned':   'RETURNED',
                'rejected':   'REJECTED' as any,
                'cancelled':  'REJECTED' as any,
            };

            let status = statusMap[b.status] || 'BORROWED';

            if (status === 'BORROWED' && b.return_date && new Date(b.return_date) < new Date()) {
                status = 'OVERDUE';
            }

            const extractClassInfo = (note: string) => {
                if (!note) return null;
                const coursePattern = /([A-Z]{2,3}\d{4})/i;
                const roomPattern   = /(?:Phòng|Room|Lớp|Class)\s*([A-Z]*\d+[A-Z]*)/i;
                const courseMatch   = note.match(coursePattern);
                const roomMatch     = note.match(roomPattern);
                if (courseMatch) return courseMatch[0];
                if (roomMatch)   return roomMatch[0];
                return null;
            };

            const eq       = b.equipment_id as any;
            const rm       = b.room_id as any;
            const roomName = (rm && typeof rm === 'object' ? rm.name : null);
            const smartClassInfo = roomName || extractClassInfo(b.note || '') || 'Academic Use';

            return {
                id: (eq && typeof eq === 'object' ? eq.qr_code : null)
                    || (rm && typeof rm === 'object' ? rm.name : null)
                    || `#REQ-${(b._id as string)?.substring(18).toUpperCase() || '....'}`,
                course:        smartClassInfo,
                group:         b.type === 'equipment' ? 'Equipment Request' : (b.type || 'Infrastructure'),
                equipmentName: (eq && typeof eq === 'object' ? eq.name : null)
                               || (rm && typeof rm === 'object' ? rm.name : null)
                               || 'Asset',
                icon:    CATEGORY_ICONS[(eq?.category || '').toLowerCase()] || (b.room_id ? Monitor : Laptop),
                period:  `${b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'} – ${b.return_date ? new Date(b.return_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'}`,
                returnDate: b.note || '-',
                status: status as BorrowStatus,
                original: b,
            };
        });
    }, [borrowRequests]);

    const mappedApproval = useMemo<ApprovalHistoryItem[]>(() => {
        return approvedByMe.map(a => {
            const userRef    = a.user_id as BorrowRequestUser;
            const equipment  = a.equipment_id as BorrowRequestEquipment;
            const room       = a.room_id as BorrowRequestRoom;

            const APPROVED_STATUSES = ['approved', 'handed_over', 'returned'];
            const decision: 'APPROVED' | 'REJECTED' = APPROVED_STATUSES.includes(a.status)
                ? 'APPROVED'
                : 'REJECTED';

            return {
                id:          `#APP-${(a._id as string).substring(18).toUpperCase()}`,
                studentName: userRef?.displayName || 'User',
                studentId:   (userRef?._id as string || '').substring(18).toUpperCase(),
                equipment:   equipment?.name || room?.name || 'Asset',
                requestDate: a.borrow_date ? new Date(a.borrow_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
                decidedDate: a.updatedAt    ? new Date(a.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
                decision,
                reason: a.note?.split('| Rejection Reason: ')[1] || undefined,
            };
        });
    }, [approvedByMe]);

    return { mappedReports, mappedBorrow, mappedApproval };
}
