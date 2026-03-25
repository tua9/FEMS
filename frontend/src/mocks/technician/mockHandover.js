// ─── Handover Management — mock data ────────────────────────────────────────

// ── Tab type ─────────────────────────────────────────────────────────────────
// ── Shared sub-types ─────────────────────────────────────────────────────────
// ── Borrow Requests (tab) ──────────────────────────────────────────
export const MOCK_BORROW_REQUESTS= [
 {
 id: '#REQ-2024-089',
 borrower: { name: 'Prof. Sarah Jenkins', userId: '102938', department: 'Arts & Design', email: 'sarah.jenkins@fpt.edu.vn' },
 equipment: { name: 'iPad Pro + Apple Pencil', location: 'Art Dept Inventory' },
 duration: '3 Days',
 purpose: 'Digital Illustration Workshop for Year 2 Students',
 items: [
 { icon: 'tablet_mac', name: 'iPad Pro 12.9"', serial: 'AP-IPD-2023-014', condition: 'Good' },
 { icon: 'stylus_note', name: 'Apple Pencil 2nd', serial: 'AP-PCL-2023-055', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 26, 09:00', label: 'Request Submitted', done: true },
 { date: 'Oct 26, 10:30', label: 'Pending Approval', done: true },
 { date: '—', label: 'Approved / Rejected', done: false },
 { date: '—', label: 'Equipment Picked Up', done: false },
 ],
 },
 {
 id: '#REQ-2024-092',
 borrower: { name: 'James Wilson', userId: 'STU-4402', department: 'Media Studies', email: 'james.wilson@fpt.edu.vn' },
 equipment: { name: 'Canon EOS R6 Kit', location: 'Media Lab' },
 duration: '24 Hours',
 purpose: 'Outdoor Photography Assignment',
 items: [
 { icon: 'camera', name: 'Canon EOS R6 Body', serial: 'CN-R6-2022-009', condition: 'Good' },
 { icon: 'lens_blur', name: '24-70mm RF Lens', serial: 'CN-LNS-2022-017', condition: 'Good' },
 { icon: 'inventory_2', name: 'Camera Bag + Strap',serial: 'ACC-BAG-2022-033', condition: 'Fair' },
 ],
 timeline: [
 { date: 'Oct 25, 14:10', label: 'Request Submitted', done: true },
 { date: '—', label: 'Pending Approval', done: false },
 ],
 },
 {
 id: '#REQ-2024-095',
 borrower: { name: 'Dr. Elena Rodriguez', userId: '559021', department: 'Computer Engineering', email: 'e.rodriguez@fpt.edu.vn' },
 equipment: { name: 'Dell Precision Workstation', location: 'Engineering Tower' },
 duration: '14 Days',
 purpose: 'High-performance computing for research project',
 items: [
 { icon: 'desktop_windows', name: 'Dell Precision 5860', serial: 'DL-WS-2023-007', condition: 'Excellent' },
 ],
 timeline: [
 { date: 'Oct 24, 08:45', label: 'Request Submitted', done: true },
 { date: 'Oct 24, 09:15', label: 'Pending Approval', done: true },
 ],
 },
 {
 id: '#REQ-2024-101',
 borrower: { name: 'Mark Thompson', userId: 'STU-8821', department: 'Interaction Design', email: 'm.thompson@fpt.edu.vn' },
 equipment: { name: 'Oculus Rift S + Controllers', location: 'VR Lab' },
 duration: '2 Days',
 purpose: 'Interaction design prototype testing',
 items: [
 { icon: 'view_in_ar', name: 'Oculus Rift S Headset', serial: 'VR-RFT-2021-003', condition: 'Good' },
 { icon: 'sports_esports', name: 'Touch Controllers (x2)', serial: 'VR-CTL-2021-003', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 25, 11:30', label: 'Request Submitted', done: true },
 ],
 },
 {
 id: '#REQ-2024-105',
 borrower: { name: 'Dr. Alan Park', userId: '881102', department: 'Communications', email: 'alan.park@fpt.edu.vn' },
 equipment: { name: 'Sony A7 IV Camera', location: 'Media Lab' },
 duration: '7 Days',
 purpose: 'Documentary production for university research',
 items: [
 { icon: 'camera', name: 'Sony A7 IV Body', serial: 'SNY-A7-2023-011', condition: 'Excellent' },
 ],
 timeline: [
 { date: 'Oct 23, 16:00', label: 'Request Submitted', done: true },
 ],
 },
 {
 id: '#REQ-2024-108',
 borrower: { name: 'Lisa Nguyen', userId: 'STU-3310', department: 'Graphic Design', email: 'lisa.nguyen@fpt.edu.vn' },
 equipment: { name: 'Wacom Cintiq 22', location: 'Design Studio' },
 duration: '5 Days',
 purpose: 'Final year design thesis project',
 items: [
 { icon: 'stylus_note', name: 'Wacom Cintiq 22', serial: 'WC-CQ-2022-009', condition: 'Good' },
 { icon: 'cable', name: 'USB-C Power Cable', serial: 'ACC-USB-2022-044', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 22, 13:00', label: 'Request Submitted', done: true },
 ],
 },
 {
 id: '#REQ-2024-112',
 borrower: { name: 'Prof. Kevin Lee', userId: '770044', department: 'Business Admin', email: 'kevin.lee@fpt.edu.vn' },
 equipment: { name: 'Polycom Video Conferencing', location: 'AV Room' },
 duration: '1 Day',
 purpose: 'International faculty meeting',
 items: [
 { icon: 'video_call', name: 'Polycom RealPresence', serial: 'PLC-VP-2020-002', condition: 'Fair' },
 ],
 timeline: [
 { date: 'Oct 26, 07:30', label: 'Request Submitted', done: true },
 ],
 },
 {
 id: '#REQ-2024-119',
 borrower: { name: 'Tom Baker', userId: 'STU-9901', department: 'Journalism', email: 'tom.baker@fpt.edu.vn' },
 equipment: { name: 'DJI Mavic 3 Drone', location: 'Media Lab' },
 duration: '3 Days',
 purpose: 'Aerial photography assignment for journalism class',
 items: [
 { icon: 'flight', name: 'DJI Mavic 3 Drone', serial: 'DJI-M3-2023-006', condition: 'Excellent' },
 { icon: 'battery_charging_full', name: 'Battery Pack x2', serial: 'DJI-BAT-2023-012', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 26, 10:00', label: 'Request Submitted', done: true },
 ],
 },
];

// ── Handover Fulfillment (tab) ─────────────────────────────────────
export const MOCK_FULFILLMENTS= [
 {
 id: 'REQ-8821',
 time: '14:20 PM',
 borrowerName: 'Dr. Sarah Jenkins',
 borrowerRole: 'Lecturer • Computer Science',
 itemCount: 2,
 recipient: {
 name: 'Dr. Sarah Jenkins',
 userId: '4492-3301-LL',
 department: 'Computer Science',
 designation: 'Senior Lecturer',
 },
 items: [
 { icon: 'laptop_mac', name: 'MacBook Pro M2', serial: 'AP-MB-2024-092' },
 { icon: 'hub', name: 'USB-C Hub Multi', serial: 'AC-HB-2023-441' },
 ],
 },
 {
 id: 'REQ-8790',
 time: '12:15 PM',
 borrowerName: 'Marcus Holloway',
 borrowerRole: 'Student • Final Year Project',
 itemCount: 1,
 recipient: {
 name: 'Marcus Holloway',
 userId: 'STU-7742',
 department: 'Computer Engineering',
 designation: 'Final Year Student',
 },
 items: [{ icon: 'tablet_mac', name: 'iPad Air 5th Gen', serial: 'AP-IA-2023-055' }],
 },
 {
 id: 'REQ-8785',
 time: '09:45 AM',
 borrowerName: 'Admin: IT Services',
 borrowerRole: 'Department • Infrastructure',
 itemCount: 5,
 recipient: {
 name: 'IT Services Dept.',
 userId: 'DEPT-IT-001',
 department: 'Infrastructure',
 designation: 'Department Account',
 },
 items: [
 { icon: 'router', name: 'Cisco Catalyst Switch', serial: 'CC-SW-2022-007' },
 { icon: 'desktop_windows', name: 'Dell OptiPlex 3090', serial: 'DL-OP-2023-034' },
 { icon: 'keyboard', name: 'Logitech MX Keys', serial: 'LG-KB-2024-019' },
 { icon: 'monitor', name: 'Dell 24" Monitor', serial: 'DL-MN-2023-088' },
 { icon: 'cable', name: 'HDMI Cable Bundle', serial: 'GEN-CAB-2024' },
 ],
 },
];

// ── Active Loans (tab) ───────────────────────────────────────────────
export const MOCK_ACTIVE_LOANS= [
 {
 id: 'LOAN-001',
 borrower: { name: 'Dr. Sarah Jenkins', idLabel: 'Faculty ID: #F-1029', email: 'sarah.jenkins@fpt.edu.vn', department: 'Arts & Design' },
 status: 'Overdue',
 itemCount: 2,
 itemNames: 'Sony Alpha A7 IV, 24-70mm Lens',
 dueLabel: 'Due Oct 24, 2024',
 dueColor: 'red',
 dueIcon: 'event_busy',
 borrowedDate: 'Oct 17, 2024',
 items: [
 { icon: 'camera', name: 'Sony Alpha A7 IV', serial: 'SNY-A7-2023-011', condition: 'Good' },
 { icon: 'lens_blur', name: '24-70mm Lens', serial: 'SNY-LNS-2023-005', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 17, 09:00', label: 'Equipment Borrowed', sub: 'Picked up from Media Lab', done: true },
 { date: 'Oct 24, 17:00', label: 'Due Date Passed', sub: 'No return recorded', done: true },
 { date: '—', label: 'Awaiting Return', sub: 'Overdue — please contact', done: false },
 ],
 notes: 'Borrower contacted via email on Oct 25. Awaiting response.',
 },
 {
 id: 'LOAN-002',
 borrower: { name: 'James Wilson', idLabel: 'Student ID: #S-8821', email: 'james.wilson@fpt.edu.vn', department: 'Media Studies' },
 status: 'Due Today',
 itemCount: 1,
 itemNames: 'Wacom Intuos Pro L',
 dueLabel: 'Due Today, 5:00 PM',
 dueColor: 'yellow',
 dueIcon: 'event',
 borrowedDate: 'Oct 26, 2024',
 items: [
 { icon: 'stylus_note', name: 'Wacom Intuos Pro L', serial: 'WC-INT-2022-008', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 26, 10:00', label: 'Equipment Borrowed', sub: 'Picked up from Design Studio', done: true },
 { date: 'Oct 27, 17:00', label: 'Return Due Today', sub: 'Must be returned by 5:00 PM', done: false },
 ],
 },
 {
 id: 'LOAN-003',
 borrower: { name: 'Maria Garcia', idLabel: 'Student ID: #S-4432', email: 'maria.garcia@fpt.edu.vn', department: 'Computer Science' },
 status: 'Active',
 itemCount: 3,
 itemNames: 'MacBook Pro M2, Laptop Stand, Mouse',
 dueLabel: 'Due Oct 30, 2024',
 dueColor: 'slate',
 dueIcon: 'calendar_today',
 borrowedDate: 'Oct 20, 2024',
 items: [
 { icon: 'laptop_mac', name: 'MacBook Pro M2', serial: 'AP-MB-2024-044', condition: 'Excellent' },
 { icon: 'laptop_mac', name: 'Laptop Stand', serial: 'ACC-STD-2023-012', condition: 'Good' },
 { icon: 'mouse', name: 'Logitech MX Master', serial: 'LG-MX-2023-007', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 20, 14:00', label: 'Equipment Borrowed', sub: 'Picked up from IT Store', done: true },
 { date: 'Oct 30, 17:00', label: 'Return Due', sub: 'On schedule', done: false },
 ],
 },
];

// ── History / Audit Log (tab) ───────────────────────────────────────
export const MOCK_HISTORY= [
 {
 id: 'H1',
 eventType: 'Handover',
 logId: '#H-2024-0012',
 recipient: { initials: 'SC', name: 'Sarah Connor', role: 'Faculty Member', avatarBg: 'bg-blue-100', avatarColor: 'text-blue-600', email: 'sarah.connor@fpt.edu.vn' },
 equipment: { icon: 'laptop_mac', name: 'MacBook Pro M2 (SN: 9921)' },
 date: 'Oct 24, 2024', time: '10:45 AM',
 condition: 'Mint Condition', conditionColor: 'text-emerald-500',
 items: [
 { icon: 'laptop_mac', name: 'MacBook Pro M2', serial: 'AP-MB-2024-009', condition: 'Mint' },
 ],
 timeline: [
 { date: 'Oct 22', label: 'Request Approved', done: true },
 { date: 'Oct 24', label: 'Equipment Collected', done: true },
 { date: 'Oct 24 10:45', label: 'Handover Confirmed', sub: 'Signed by both parties', done: true },
 ],
 },
 {
 id: 'H2',
 eventType: 'Return',
 logId: '#R-2024-0008',
 recipient: { initials: 'JD', name: 'James Doe', role: 'Student', avatarBg: 'bg-purple-100', avatarColor: 'text-purple-600', email: 'james.doe@fpt.edu.vn' },
 equipment: { icon: 'tablet_android', name: 'iPad Air (SN: 1102)' },
 date: 'Oct 23, 2024', time: '03:20 PM',
 condition: 'Scratched Screen', conditionColor: 'text-amber-500',
 items: [
 { icon: 'tablet_android', name: 'iPad Air 5th Gen', serial: 'AP-IA-2022-011', condition: 'Scratched Screen' },
 ],
 timeline: [
 { date: 'Oct 18', label: 'Equipment Borrowed', done: true },
 { date: 'Oct 23', label: 'Returned', sub: 'Minor damage noted on screen', done: true },
 ],
 notes: 'Screen scratch documented. User notified of potential damage charge.',
 },
 {
 id: 'H3',
 eventType: 'Reject',
 logId: '#X-2024-0044',
 recipient: { initials: 'ML', name: 'Mark Lee', role: 'Guest Speaker', avatarBg: 'bg-slate-100', avatarColor: 'text-slate-600', email: 'mark.lee@external.com' },
 equipment: { icon: 'videocam', name: 'DSLR Camera (SN: 4432)' },
 date: 'Oct 22, 2024', time: '09:12 AM',
 condition: 'Major Damage', conditionColor: 'text-rose-500',
 items: [
 { icon: 'videocam', name: 'DSLR Camera Body', serial: 'CAM-DL-2021-004', condition: 'Major Damage — Lens cracked' },
 ],
 timeline: [
 { date: 'Oct 22', label: 'Return Attempted', done: true },
 { date: 'Oct 22 09:12', label: 'Rejected — Damage Found', sub: 'Incident report filed', done: true },
 ],
 notes: 'Lens cracked upon return. Incident report filed. Asset sent to repair bay.',
 },
 {
 id: 'H4',
 eventType: 'Handover',
 logId: '#H-2024-0011',
 recipient: { initials: 'AW', name: 'Alan Wake', role: 'External Vendor', avatarBg: 'bg-orange-100', avatarColor: 'text-orange-600', email: 'alan.wake@vendor.com' },
 equipment: { icon: 'mic', name: 'Wireless Mic Set (SN: 221)' },
 date: 'Oct 21, 2024', time: '01:55 PM',
 condition: 'Good', conditionColor: 'text-slate-500',
 items: [
 { icon: 'mic', name: 'Wireless Mic Transmitter', serial: 'MIC-WL-2022-021', condition: 'Good' },
 { icon: 'mic_none', name: 'Mic Receiver Unit', serial: 'MIC-WL-2022-022', condition: 'Good' },
 ],
 timeline: [
 { date: 'Oct 21', label: 'Approved for Handover', done: true },
 { date: 'Oct 21 13:55', label: 'Handover Completed', sub: 'Vendor signed receipt', done: true },
 ],
 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getEventStyle(type) {
 const map= {
 Handover: { pill: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500', text: 'Handover' },
 Return: { pill: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500', text: 'Return' },
 Reject: { pill: 'bg-rose-100 text-rose-600', dot: 'bg-rose-500', text: 'Reject' },
 };
 return map[type];
}

export function getLoanStatusStyle(status) {
 const map = {
 Overdue: { badge: 'bg-red-100 text-red-600', border: 'border-red-500/50' },
 'Due Today': { badge: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-500/50' },
 Active: { badge: 'bg-blue-50 text-blue-600', border: 'border-white/50' },
 };
 return map[status];
}
