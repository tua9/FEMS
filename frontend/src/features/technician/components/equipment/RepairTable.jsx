import { useState } from "react";

const STATUS_CONFIG = {
  pending: {
    label: "Chờ duyệt",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Đã duyệt",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  processing: {
    label: "Đang sửa",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  fixed: {
    label: "Hoàn thành",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  },
};

const PRIORITY_COLOR = {
  critical: "text-red-600 dark:text-red-400",
  high: "text-orange-600 dark:text-orange-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-slate-500 dark:text-slate-400",
};

const STATUS_FILTERS = [
  "all",
  "pending",
  "approved",
  "processing",
  "fixed",
  "rejected",
];

const RepairDetailModal = ({ report, onClose, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [cause, setCause] = useState(report.cause ?? "");
  const [outcome, setOutcome] = useState(report.outcome ?? "");
  const [note, setNote] = useState("");

  const cfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.pending;

  const TRANSITIONS = {
    pending: ["approved", "rejected"],
    approved: ["processing", "rejected"],
    processing: ["fixed"],
  };
  const allowed = TRANSITIONS[report.status] ?? [];

  const ACTION_LABELS = {
    approved: {
      label: "Duyệt",
      icon: "check_circle",
      cls: "bg-blue-600 text-white hover:bg-blue-700",
    },
    rejected: {
      label: "Từ chối",
      icon: "cancel",
      cls: "bg-red-500 text-white hover:bg-red-600",
    },
    processing: {
      label: "Bắt đầu sửa",
      icon: "build",
      cls: "bg-purple-600 text-white hover:bg-purple-700",
    },
    fixed: {
      label: "Đánh dấu hoàn thành",
      icon: "task_alt",
      cls: "bg-green-600 text-white hover:bg-green-700",
    },
  };

  const handleAction = async (newStatus) => {
    setLoading(true);
    await onUpdateStatus(report._id, {
      status: newStatus,
      cause: cause || undefined,
      outcome: outcome || undefined,
      decision_note: note || undefined,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dashboard-card w-full max-w-md overflow-hidden rounded-4xl p-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="space-y-1">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${cfg.color}`}
            >
              {cfg.label}
            </span>
            <h2 className="mt-2 text-base font-extrabold text-[#1A2B56] dark:text-white">
              {report.equipment_id?.name ?? "Thiết bị"}
            </h2>
            <p className="text-xs text-slate-400">
              {report.code ?? report._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-6 border-t border-slate-100 dark:border-slate-700" />

        <div className="space-y-3 px-6 py-4">
          {/* Description */}
          {report.description && (
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Mô tả
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {report.description}
              </p>
            </div>
          )}

          {/* Reporter + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Người báo
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {report.user_id?.displayName ?? "—"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Mức độ
              </p>
              <p
                className={`text-xs font-bold uppercase ${PRIORITY_COLOR[report.priority] ?? ""}`}
              >
                {report.priority}
              </p>
            </div>
          </div>

          {/* Cause + Outcome (only when processing or fixing) */}
          {(report.status === "approved" || report.status === "processing") && (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Nguyên nhân
                </label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="">— Chưa xác định —</option>
                  <option value="user_error">Lỗi người dùng</option>
                  <option value="hardware">Phần cứng</option>
                  <option value="software">Phần mềm</option>
                  <option value="environment">Môi trường</option>
                </select>
              </div>
              {report.status === "processing" && (
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Kết quả sửa
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="">— Chọn kết quả —</option>
                    <option value="fixed_internally">Tự sửa được</option>
                    <option value="external_warranty">Bảo hành ngoài</option>
                    <option value="beyond_repair">Không thể sửa</option>
                  </select>
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {allowed.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            {allowed.map((s) => {
              const ac = ACTION_LABELS[s];
              if (!ac) return null;
              return (
                <button
                  key={s}
                  disabled={loading}
                  onClick={() => handleAction(s)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${ac.cls} disabled:opacity-60`}
                >
                  <span className="material-symbols-outlined text-base">
                    {ac.icon}
                  </span>
                  {ac.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const RepairTable = ({ reports, onUpdateStatus, loading }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = (reports ?? []).filter(
    (r) => statusFilter === "all" || r.status === statusFilter,
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#1A2B56] dark:text-white">
          Thiết bị đang sửa chữa
        </h3>
      </div>

      {/* Status filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === s
                ? "bg-[#1A2B56] text-white dark:bg-blue-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {s === "all" ? "Tất cả" : (STATUS_CONFIG[s]?.label ?? s)}
            {s !== "all" && (
              <span className="ml-1.5 opacity-70">
                {(reports ?? []).filter((r) => r.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#1A2B56] dark:border-blue-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <span className="material-symbols-outlined mb-2 block text-4xl">
            inbox
          </span>
          <p className="text-sm">Không có báo cáo nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {[
                  "Thiết bị",
                  "Người báo",
                  "Mức độ",
                  "Trạng thái",
                  "Ngày báo",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="pr-4 pb-3 text-left text-[10px] font-bold tracking-widest text-slate-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map((r) => {
                const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr
                    key={r._id}
                    className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    onClick={() => setSelected(r)}
                  >
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {r.equipment_id?.name ?? "—"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {r.code ?? r._id?.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-600 dark:text-slate-400">
                      {r.user_id?.displayName ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[10px] font-bold uppercase ${PRIORITY_COLOR[r.priority] ?? ""}`}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="py-3">
                      <span className="material-symbols-outlined text-base text-slate-300 dark:text-slate-600">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <RepairDetailModal
          report={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={async (id, payload) => {
            await onUpdateStatus(id, payload);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

export default RepairTable;
