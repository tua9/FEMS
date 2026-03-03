import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Video, TabletSmartphone, Monitor, Camera, Mic, X, ArrowRight, CalendarDays, FileText } from 'lucide-react';

import LecturerNavbar from '../../components/lecturer/navbar/LecturerNavbar';
import { EquipmentFilter } from '../../components/lecturer/equipment/EquipmentFilter';
import { EquipmentCategories } from '../../components/lecturer/equipment/EquipmentCategories';
import { EquipmentGrid, EquipmentItem, EquipmentType, LocationKey, EquipmentStatus } from '../../components/lecturer/equipment/EquipmentGrid';
import { BorrowedEquipmentGrid } from '../../components/lecturer/equipment/BorrowedEquipmentGrid';

// ─── Static Equipment Data ────────────────────────────────────────────────────

const ALL_EQUIPMENT: EquipmentItem[] = [
    { id: '1',  title: 'MacBook Pro M2',       sku: 'FPT-LAP-082', location: 'Lab Room 402',    locationKey: 'gamma', type: 'laptop',    status: 'Available',   icon: Laptop          },
    { id: '2',  title: '4K Laser Projector',   sku: 'FPT-PJ-014',  location: 'Resource Desk',   locationKey: 'gamma', type: 'projector',  status: 'Available',   icon: Video           },
    { id: '3',  title: 'iPad Air 5th Gen',      sku: 'FPT-TAB-055', location: 'Library A',       locationKey: 'alpha', type: 'tablet',     status: 'In Use',      icon: TabletSmartphone },
    { id: '4',  title: 'UltraWide Monitor',    sku: 'FPT-MN-033',  location: 'Room 205',        locationKey: 'gamma', type: 'monitor',   status: 'Available',   icon: Monitor         },
    { id: '5',  title: 'Sony A7 IV Camera',    sku: 'FPT-CAM-011', location: 'Media Lab',       locationKey: 'alpha', type: 'camera',    status: 'Available',   icon: Camera          },
    { id: '6',  title: 'Focusrite Interface',  sku: 'FPT-AUD-007', location: 'Studio B',        locationKey: 'alpha', type: 'audio',     status: 'Available',   icon: Mic             },
    { id: '7',  title: 'Dell XPS 15',          sku: 'FPT-LAP-097', location: 'Lab Room 408',    locationKey: 'gamma', type: 'laptop',    status: 'Maintenance', icon: Laptop          },
    { id: '8',  title: 'Epson Smart Projector',sku: 'FPT-PJ-022',  location: 'Seminar Room A',  locationKey: 'alpha', type: 'projector',  status: 'Available',   icon: Video           },
    { id: '9',  title: 'Samsung Galaxy Tab S9',sku: 'FPT-TAB-061', location: 'Library B',       locationKey: 'alpha', type: 'tablet',     status: 'Available',   icon: TabletSmartphone },
    { id: '10', title: 'LG 4K Display',        sku: 'FPT-MN-044',  location: 'Room 301',        locationKey: 'gamma', type: 'monitor',   status: 'In Use',      icon: Monitor         },
    { id: '11', title: 'Canon EOS R6',         sku: 'FPT-CAM-019', location: 'Media Lab',       locationKey: 'alpha', type: 'camera',    status: 'In Use',      icon: Camera          },
    { id: '12', title: 'Shure MV7 Mic',        sku: 'FPT-AUD-013', location: 'Podcast Room',    locationKey: 'gamma', type: 'audio',     status: 'Available',   icon: Mic             },
];

const ITEMS_PER_PAGE = 4;

// Category id → EquipmentType (or 'all')
const CATEGORY_TO_TYPE: Record<string, string> = {
    all:       'all-types',
    laptop:    'laptop',
    projector: 'projector',
    tablet:    'tablet',
    monitor:   'monitor',
    camera:    'camera',
    audio:     'audio',
};

const TYPE_TO_CATEGORY: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_TO_TYPE).map(([k, v]) => [v, k])
);

// ─── Component ────────────────────────────────────────────────────────────────

export const EquipmentCatalog: React.FC = () => {
    const navigate = useNavigate();

    // ── Filter state ──────────────────────────────────────────────────────────
    const [searchText,    setSearchText]    = useState('');
    const [typeFilter,    setTypeFilter]    = useState('all-types');
    const [locationFilter,setLocationFilter]= useState('all-locations');
    const [activeCategory,setActiveCategory]= useState('all');
    const [currentPage,   setCurrentPage]  = useState(1);

    // ── Borrow modal state ────────────────────────────────────────────────────
    const [borrowingItem, setBorrowingItem] = useState<EquipmentItem | null>(null);
    const [returnDate,    setReturnDate]    = useState('');
    const [purpose,       setPurpose]       = useState('');
    const [formError,     setFormError]     = useState('');

    // ── Sync category ↔ type dropdown ─────────────────────────────────────────
    const handleTypeChange = (val: string) => {
        setTypeFilter(val);
        setActiveCategory(TYPE_TO_CATEGORY[val] ?? 'all');
        setCurrentPage(1);
    };

    const handleCategoryChange = (id: string) => {
        setActiveCategory(id);
        setTypeFilter(CATEGORY_TO_TYPE[id] ?? 'all-types');
        setCurrentPage(1);
    };

    const handleFilter = () => {
        setCurrentPage(1);
    };

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filteredEquipment = useMemo(() => {
        return ALL_EQUIPMENT.filter(item => {
            const q = searchText.toLowerCase();
            if (q && !item.title.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) return false;
            if (typeFilter !== 'all-types' && item.type !== (typeFilter as EquipmentType)) return false;
            if (locationFilter !== 'all-locations' && item.locationKey !== (locationFilter as LocationKey)) return false;
            return true;
        });
    }, [searchText, typeFilter, locationFilter]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages   = Math.max(1, Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE));
    const safePage     = Math.min(currentPage, totalPages);
    const pagedItems   = filteredEquipment.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Borrow modal ──────────────────────────────────────────────────────────
    const today    = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

    const openBorrowModal = (item: EquipmentItem) => {
        setBorrowingItem(item);
        setReturnDate(tomorrow);
        setPurpose('');
        setFormError('');
    };

    const closeBorrowModal = () => {
        setBorrowingItem(null);
        setFormError('');
    };

    const handleSubmitBorrow = (e: React.FormEvent) => {
        e.preventDefault();
        if (!returnDate) { setFormError('Please select a return date.'); return; }
        if (!purpose.trim()) { setFormError('Please enter the purpose of borrowing.'); return; }

        navigate('/lecturer/approval', {
            state: {
                newBorrowRequest: {
                    equipmentId:   borrowingItem!.id,
                    equipmentTitle:borrowingItem!.title,
                    equipmentSku:  borrowingItem!.sku,
                    location:      borrowingItem!.location,
                    returnDate,
                    purpose: purpose.trim(),
                    requestedAt: new Date().toISOString(),
                },
            },
        });
    };

    // ── Render page buttons ───────────────────────────────────────────────────
    const renderPageButtons = () => {
        if (totalPages <= 1) return null;

        const pages: (number | '...')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (safePage > 3) pages.push('...');
            for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
            if (safePage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }

        return (
            <nav className="flex flex-wrap items-center justify-center gap-[0.5rem] md:gap-[0.75rem] mb-[2rem] md:mb-[4rem]">
                <button
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage === 1}
                    className="w-[2.75rem] h-[2.75rem] flex items-center justify-center rounded-full hover:bg-white/40 dark:hover:bg-slate-800/40 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[1.125rem]">chevron_left</span>
                </button>

                {pages.map((p, idx) =>
                    p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-[2.75rem] h-[2.75rem] flex items-center justify-center opacity-40 text-[#1E2B58] dark:text-white text-[1rem]">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p as number)}
                            className={`w-[2.75rem] h-[2.75rem] flex items-center justify-center rounded-full font-bold text-[1rem] transition-all hover:scale-105 active:scale-95 ${
                                safePage === p
                                    ? 'bg-[#1E2B58] text-white shadow-lg shadow-[#1E2B58]/20'
                                    : 'hover:bg-white/40 dark:hover:bg-slate-800/40 text-[#1E2B58] dark:text-white'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="w-[2.75rem] h-[2.75rem] flex items-center justify-center rounded-full hover:bg-white/40 dark:hover:bg-slate-800/40 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[1.125rem]">chevron_right</span>
                </button>
            </nav>
        );
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#E0EAFC] dark:bg-[#0A0F1C] text-[#1E2B58] dark:text-white transition-colors duration-300">
            <LecturerNavbar />

            <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col">
                {/* Header */}
                <section className="mb-[2.5rem] md:mb-[3.5rem]">
                    <h2 className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] font-extrabold mb-[0.75rem] text-[#1E2B58] dark:text-white leading-tight">
                        Equipment Catalog
                    </h2>
                    <p className="text-[#1E2B58]/60 dark:text-white/60 font-medium text-[1rem] sm:text-[1.125rem] max-w-2xl">
                        Explore and reserve university resources with our enhanced Lecturer Portal.
                    </p>
                </section>

                {/* Filter bar */}
                <EquipmentFilter
                    searchText={searchText}       onSearchChange={val => { setSearchText(val); setCurrentPage(1); }}
                    typeFilter={typeFilter}        onTypeChange={handleTypeChange}
                    locationFilter={locationFilter} onLocationChange={val => { setLocationFilter(val); setCurrentPage(1); }}
                    onFilter={handleFilter}
                />

                {/* Category chips */}
                <EquipmentCategories
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Equipment grid */}
                <EquipmentGrid
                    items={pagedItems}
                    totalCount={filteredEquipment.length}
                    onBorrowRequest={openBorrowModal}
                />

                {/* Borrowed equipment */}
                <BorrowedEquipmentGrid
                    onViewHistory={() => navigate('/lecturer/history')}
                    onItemClick={() => navigate('/lecturer/history')}
                />

                {/* Pagination */}
                {renderPageButtons()}
            </main>

            {/* Footer */}
            <footer className="mt-8 py-8 md:py-16 flex flex-col items-center justify-center gap-4 md:gap-6 opacity-40 shrink-0 border-t border-[#1E2B58]/10 dark:border-white/10 w-full px-4 text-center">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[#1E2B58] dark:text-white">
                    <span className="material-symbols-outlined text-xl md:text-2xl">school</span>
                    <span className="material-symbols-outlined text-xl md:text-2xl">verified_user</span>
                    <span className="material-symbols-outlined text-xl md:text-2xl">build</span>
                </div>
                <p className="text-[0.625rem] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[#1E2B58] dark:text-white max-w-full truncate whitespace-normal">
                    Facility & Equipment Management System — F-EMS 2024
                </p>
            </footer>

            {/* ── Borrow Request Modal ───────────────────────────────────────── */}
            {borrowingItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={e => { if (e.target === e.currentTarget) closeBorrowModal(); }}
                >
                    <div className="glass-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={closeBorrowModal}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition text-[#1E2B58]/60 dark:text-white/60"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Modal header */}
                        <div className="mb-6">
                            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">
                                Borrow Request
                            </p>
                            <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white leading-tight">
                                {borrowingItem.title}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mt-1">
                                {borrowingItem.sku} • {borrowingItem.location}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmitBorrow} className="flex flex-col gap-5">
                            {/* Return date */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#1E2B58]/70 dark:text-white/60 flex items-center gap-2">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={tomorrow}
                                    value={returnDate}
                                    onChange={e => setReturnDate(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-bold text-[#1E2B58] dark:text-white outline-none focus:ring-2 focus:ring-[#1E2B58]/30 transition-all"
                                />
                            </div>

                            {/* Purpose */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#1E2B58]/70 dark:text-white/60 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" />
                                    Purpose of Borrowing
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="e.g. Teaching demo for CS101 lecture..."
                                    value={purpose}
                                    onChange={e => setPurpose(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#1E2B58]/30 transition-all resize-none"
                                />
                            </div>

                            {/* Error */}
                            {formError && (
                                <p className="text-xs font-bold text-red-500 dark:text-red-400 bg-red-500/10 rounded-xl px-4 py-2.5">
                                    {formError}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-1">
                                <button
                                    type="button"
                                    onClick={closeBorrowModal}
                                    className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:shadow-xl hover:shadow-[#1E2B58]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Submit Request
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
