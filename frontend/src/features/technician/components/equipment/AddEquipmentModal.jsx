import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CLOSE_BTN,
  INPUT_CLASS,
  MODAL_CARD,
  MODAL_OVERLAY,
  SECTION_LABEL,
  TEXTAREA_CLASS,
} from "@/features/technician/components/common/modalStyles";
import { getAssetStatusStyle } from "@/mocks/technician/mockEquipment";
import { useRef, useState } from "react";

const CATEGORIES = [
  "Computing",
  "AV Display",
  "Networking",
  "Peripherals",
  "Other",
];

const STATUSES = ["Operational", "Maintenance", "Faulty", "Offline"];

const ICON_MAP = {
  Computing: "laptop_mac",
  "AV Display": "monitor",
  Networking: "router",
  Peripherals: "print",
  Other: "category",
};

function generateId() {
  return "A-" + String(Date.now()).slice(-5);
}

const AddEquipmentModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [category, setCategory] = useState("Computing");
  const [status, setStatus] = useState("Operational");
  const [location, setLocation] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [condition, setCondition] = useState(100);
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Device name is required.");
      return;
    }
    if (!serial.trim()) {
      setError("Serial number is required.");
      return;
    }

    const newAsset = {
      id: generateId(),
      name: name.trim(),
      serial: serial.trim(),
      category,
      status,
      icon: ICON_MAP[category],
      location: location.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      condition,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
    };
    onAdd(newAsset);
  };

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={`${MODAL_CARD} max-w-lg`}
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1A2B56]">
              <span className="material-symbols-outlined text-xl text-white">
                add_circle
              </span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2B56]">
                Add New Device
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Register a new asset to the inventory
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-7 border-t border-slate-100" />

        {/* ── Scrollable form ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-7 py-6"
        >
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Name + Serial */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={`${SECTION_LABEL}`}>
                Device Name <span className="text-rose-400 normal-case">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MacBook Pro M3"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-1.5">
              <label className={SECTION_LABEL}>
                Serial Number{" "}
                <span className="text-rose-400 normal-case">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. FPT-LAP-120"
                value={serial}
                onChange={(e) => {
                  setSerial(e.target.value);
                  setError("");
                }}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className={SECTION_LABEL}>Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                    i === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0
                      ? "col-span-2"
                      : ""
                  } ${
                    category === c
                      ? "border-[#1A2B56] bg-[#1A2B56] text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {ICON_MAP[c]}
                  </span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className={SECTION_LABEL}>Initial Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const style = getAssetStatusStyle(s);
                const active = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? `${style.bg} ${style.border} ${style.color}`
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className={SECTION_LABEL}>Location</label>
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-slate-400">
                location_on
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Room 201 – FPT Tower A"
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>
          </div>

          {/* Purchase Date + Condition */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={SECTION_LABEL}>Purchase Date</label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base text-slate-400">
                  calendar_month
                </span>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={`${SECTION_LABEL} flex justify-between`}>
                <span>Initial Condition</span>
                <span className="font-semibold text-slate-600 normal-case">
                  {condition}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer rounded-full accent-[#1A2B56]"
              />
            </div>
          </div>

          {/* Device Image */}
          <div className="space-y-1.5">
            <label className={SECTION_LABEL}>Device Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageUrl ? (
              <div
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                style={{ height: 160 }}
              >
                <img
                  src={imageUrl}
                  alt="Device preview"
                  className="h-full w-full object-cover"
                />
                {/* overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#1A2B56] shadow"
                  >
                    <span className="material-symbols-outlined text-sm">
                      edit
                    </span>
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 transition-all hover:border-[#1A2B56]/30 hover:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A2B56]/8">
                  <span className="material-symbols-outlined text-2xl text-[#1A2B56]/60">
                    add_photo_alternate
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-600">
                    Click to upload image
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    PNG, JPG, WEBP · Max 5MB
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className={SECTION_LABEL}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about this asset..."
              rows={3}
              className={TEXTAREA_CLASS}
            />
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex gap-3 border-t border-slate-100 px-7 py-5">
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-base">
              add_circle
            </span>
            Add Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
