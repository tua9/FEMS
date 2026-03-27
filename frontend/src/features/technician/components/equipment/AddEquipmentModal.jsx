import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '@/lib/axios';
import { uploadImages } from '@/utils/uploadHelper';

const CATEGORIES = [
  'Computing', 'AV Display', 'Networking', 'Peripherals', 'Infrastructure', 'Other',
];

// ── Styled Select ─────────────────────────────────────────────────────────────
const StyledSelect = ({ value, onChange, disabled, children, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full appearance-none px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/80 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">
      expand_more
    </span>
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
    {children}{required && <span className="text-red-400 normal-case ml-0.5">*</span>}
  </label>
);

// ── Main Modal ────────────────────────────────────────────────────────────────
const AddEquipmentModal = ({ onClose, onAdd }) => {
  const [name,         setName]         = useState('');
  const [category,     setCategory]     = useState('');
  const [buildingId,   setBuildingId]   = useState('');
  const [roomId,       setRoomId]       = useState('');
  const [imageFile,    setImageFile]    = useState(null);   // raw File for upload
  const [imagePreview, setImagePreview] = useState('');    // DataURL for preview only
  const [error,        setError]        = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  const [buildings,    setBuildings]    = useState([]);
  const [rooms,        setRooms]        = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch buildings
  useEffect(() => {
    api.get('/buildings')
      .then((res) => setBuildings(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  // Fetch rooms when building changes
  useEffect(() => {
    if (!buildingId) { setRooms([]); setRoomId(''); return; }
    setLoadingRooms(true);
    setRoomId('');
    api.get(`/rooms/building/${buildingId}`)
      .then((res) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRooms([]))
      .finally(() => setLoadingRooms(false));
  }, [buildingId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload a valid image file (WEBP/PNG/JPG).'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('Image size must be under 5 MB.'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target?.result ?? ''); setError(''); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) { setError('Asset name is required.'); return; }
    if (!category)    { setError('Primary category is required.'); return; }

    setSubmitting(true);
    setError('');

    try {
      // Step 1: upload image (if any) via multipart — NOT base64 in JSON
      let imgUrl = null;
      if (imageFile) {
        try {
          const urls = await uploadImages([imageFile]);
          imgUrl = urls[0] ?? null;
        } catch (uploadErr) {
          console.error('[AddEquipmentModal] image upload failed:', uploadErr);
          setError('Image upload failed. The equipment will be created without an image.');
          imgUrl = null;
        }
      }

      // Step 2: create equipment with URL (not base64)
      await onAdd({
        name:     name.trim(),
        category,
        roomId:   roomId || null,
        img:      imgUrl,
        status:   'available',
      });

      // onAdd handles success (toast + modal close + success modal)
    } catch (err) {
      // onAdd re-throws so we can show the error inline
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to create equipment.';
      console.error('[AddEquipmentModal] submit error:', err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] rounded-[2rem] overflow-hidden flex flex-col"
        style={{ background: '#F6F7FB', boxShadow: '0 30px 80px rgba(26,43,86,0.18)', maxHeight: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 relative bg-white rounded-t-[2rem]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest mb-4">
            Asset Acquisition
          </div>
          <h2 className="text-[1.6rem] font-black text-[#1A2B56] leading-tight tracking-tight">
            Register New Equipment
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mt-2">
            Inventory Logistics &nbsp;·&nbsp; Asset Management System
          </p>
        </div>

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-8 py-6 overflow-y-auto flex-1 space-y-5 hide-scrollbar">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Asset Name */}
          <div>
            <FieldLabel required>Asset Name</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Dell UltraSharp U2723QE"
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white/80 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
            />
          </div>

          {/* Category + Building */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Primary Category</FieldLabel>
              <StyledSelect
                value={category}
                onChange={(e) => { setCategory(e.target.value); setError(''); }}
                placeholder="Select Category"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </StyledSelect>
            </div>
            <div>
              <FieldLabel>Building</FieldLabel>
              <StyledSelect
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                placeholder="All Buildings"
              >
                {buildings.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </StyledSelect>
            </div>
          </div>

          {/* Assigned Room */}
          <div>
            <FieldLabel>Assigned Room</FieldLabel>
            <StyledSelect
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={!!buildingId && loadingRooms}
              placeholder={loadingRooms ? 'Loading rooms…' : 'No Room / Storage'}
            >
              {rooms.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </StyledSelect>
          </div>

          {/* Visual Documentation */}
          <div>
            <FieldLabel>Visual Documentation</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/webp,image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div
                className="relative group rounded-[1.25rem] overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer"
                style={{ height: 152 }}
              >
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#1A2B56] text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> Change
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImageFile(null); }}
                    className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-3.5 py-10 rounded-[1.25rem] border-2 border-dashed border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300 transition-all group"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <span className="material-symbols-outlined text-[26px] text-blue-500">photo_camera</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">Register asset image</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 mt-1">WEBP, PNG or JPG supported · max 5 MB</p>
                </div>
              </button>
            )}
          </div>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="px-8 py-5 bg-white/70 border-t border-slate-200/60 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition px-1 py-2 disabled:opacity-40"
          >
            Dismiss Entry
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#1A2B56] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#14213d] active:scale-95 transition-all shadow-lg shadow-[#1A2B56]/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                Confirm Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddEquipmentModal;
