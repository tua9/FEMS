import { useMemo } from 'react';
import { FileText, Laptop, AlertTriangle, Monitor, Cable, Router, Cpu, Mic, Camera, TabletSmartphone, MonitorCog } from 'lucide-react';
// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
 laptop: Laptop,
 pc_lab: Monitor,
 iot_kit: Cpu,
 tablet: TabletSmartphone,
 camera: Camera,
 audio: Mic,
 network: Router,
 cable: Cable,
 electrical: AlertTriangle,
 infrastructure: AlertTriangle,
 it_device: MonitorCog,
 other: FileText,
};

const TYPE_LABEL = {
 equipment: 'Equipment',
 infrastructure: 'Infrastructure',
 other: 'Other',
};

const TYPE_ICON = {
 equipment: Monitor,
 infrastructure: AlertTriangle,
 other: FileText,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Maps raw store data into the display shapes used by the history tables.
 */
export function useHistoryMappings(
 myReports,
 borrowRequests,
 approvedByMe) {
 const mappedReports = useMemo(() => {
 if (!myReports) return [];

 return myReports.map((r) => {
 const room = (r.room_id && typeof r.room_id === 'object') ? r.room_id : null;
 const eq = (r.equipment_id && typeof r.equipment_id === 'object') ? r.equipment_id : null;
 const locationLabel = room?.name || eq?.name || 'Unknown';
 const type = (r.type || 'other').toLowerCase();

 return {
 id: r.code || `#${(r._id)?.substring(18).toUpperCase() || 'ID'}`,
 date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
 category: TYPE_LABEL[type] ?? 'Other',
 location: locationLabel,
 block: '-',
 severity: (r.severity?.toUpperCase()) || 'MEDIUM',
 status: ((r.status?.toUpperCase() || 'PENDING')),
 icon: TYPE_ICON[type] ?? FileText,
 description: r.description,
 img: r.img,
 decision_note: r.decision_note || undefined,
 original: r,
 };
 });
 }, [myReports]);

 const mappedBorrow = useMemo(() => {
 if (!borrowRequests) return [];

 return borrowRequests.map(b => {
 const statusMap= {
 'pending': 'PENDING',
 'approved': 'APPROVED',
 'handed_over':'BORROWED',
 'returned': 'RETURNED',
 'rejected': 'REJECTED',
 'cancelled': 'REJECTED',
 };

 let status = statusMap[b.status] || 'BORROWED';

 if (status === 'BORROWED' && b.expectedReturnDate && new Date(b.expectedReturnDate) < new Date()) {
 status = 'OVERDUE';
 }

 const extractClassInfo = (note) => {
 if (!note) return null;
 const coursePattern = /([A-Z]{2,3}\d{4})/i;
 const roomPattern = /(?:Phòng|Room|Lớp|Class)\s*([A-Z]*\d+[A-Z]*)/i;
 const courseMatch = note.match(coursePattern);
 const roomMatch = note.match(roomPattern);
 if (courseMatch) return courseMatch[0];
 if (roomMatch) return roomMatch[0];
 return null;
 };

 const eq = b.equipmentId;
 const rm = b.roomId;
 const roomName = rm && typeof rm === 'object' ? rm.name : null;
 const smartClassInfo = roomName || extractClassInfo(b.note || '') || 'Academic Use';

 return {
 id: b.code
 || (eq && typeof eq === 'object' ? eq.qr_code : null)
 || (rm && typeof rm === 'object' ? rm.name : null)
 || `#REQ-${(b._id)?.substring(18).toUpperCase() || '....'}`,
 course: smartClassInfo,
 group: b.type === 'equipment' ? 'Equipment Request' : (b.type || 'Infrastructure'),
 equipmentName: (eq && typeof eq === 'object' ? eq.name : null)
 || (rm && typeof rm === 'object' ? rm.name : null)
 || 'Asset',
 icon: CATEGORY_ICONS[(eq?.category || '').toLowerCase()] || Monitor,
 period: `${b.borrowDate ? new Date(b.borrowDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'} – ${b.expectedReturnDate ? new Date(b.expectedReturnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'}`,
 returnDate: b.note || '-',
 status: status,
 original: b,
 };
 });
 }, [borrowRequests]);

 const mappedApproval = useMemo(() => {
 return approvedByMe.map(a => {
 const userRef = a.borrowerId;
 const equipment = a.equipmentId;
 const room = a.roomId;

 const APPROVED_STATUSES = ['approved', 'handed_over', 'returned'];
 const decision = APPROVED_STATUSES.includes(a.status)
 ? 'APPROVED'
 : 'REJECTED';

 return {
 id: a.code || `#APP-${(a._id).substring(18).toUpperCase()}`,
 studentName: userRef?.displayName || 'User',
 studentId: (userRef?._id || '').substring(18).toUpperCase(),
 equipment: equipment?.name || room?.name || 'Asset',
 requestDate: a.borrowDate ? new Date(a.borrowDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
 decidedDate: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
 decision,
 reason: a.note?.split('| Rejection Reason: ')[1] || undefined,
 };
 });
 }, [approvedByMe]);

 return { mappedReports, mappedBorrow, mappedApproval };
}
