export const NOTIFICATION_TYPE_CONFIG= {
  approval: { icon: "check_circle", bg: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-500", label: "Approval" },
  borrow: { icon: "inventory_2", bg: "bg-blue-50 dark:bg-blue-900/20", color: "text-blue-500", label: "Borrow" },
  return: { icon: "assignment_return", bg: "bg-amber-50 dark:bg-amber-900/20", color: "text-amber-500", label: "Return" },
  equipment: { icon: "devices", bg: "bg-violet-50 dark:bg-violet-900/20", color: "text-violet-500", label: "Equipment" },
  report: { icon: "build_circle", bg: "bg-rose-50 dark:bg-rose-900/20", color: "text-rose-500", label: "Report" },
  general: { icon: "notifications", bg: "bg-slate-100 dark:bg-slate-700/40", color: "text-slate-500", label: "General" },
};

export const getNotificationAction = (notification) => {
  // Ưu tiên đọc từ state
  const entityState = notification.state;
  if (entityState?.type && entityState?.id) {
    return { type: "modal", modalType: entityState.type, id: entityState.id };
  }

  // Fallback navigate
  if (notification.to) {
    return { type: "navigate", to: notification.to, state: notification.state };
  }

  return { type: "none" };
};
