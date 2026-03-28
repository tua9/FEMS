export const fmtTime = d => d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';

export const fmtDateTime = d => d
  ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  : '—';

export const getStudentName = r =>
  r.borrowerId?.displayName || r.borrowerId?.username || 'Student';

export const getEquipmentName = r =>
  r.equipmentId?.name || r.roomId?.name || 'Equipment';
