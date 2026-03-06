import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Laptop,
  Video,
  TabletSmartphone,
  Monitor,
  Camera,
  Mic,
  X,
  ArrowRight,
  CalendarDays,
  FileText,
} from "lucide-react";

import { EquipmentFilter } from "../../components/lecturer/equipment/EquipmentFilter";
import { EquipmentCategories } from "../../components/lecturer/equipment/EquipmentCategories";
import {
  EquipmentGrid,
  EquipmentItem,
  EquipmentType,
  LocationKey,
  EquipmentStatus,
} from "../../components/lecturer/equipment/EquipmentGrid";
import { BorrowedEquipmentGrid } from "../../components/lecturer/equipment/BorrowedEquipmentGrid";

// ─── Static Equipment Data ────────────────────────────────────────────────────

const ALL_EQUIPMENT: EquipmentItem[] = [
  {
    id: "1",
    title: "MacBook Pro M2",
    sku: "FPT-LAP-082",
    location: "Lab Room 402",
    locationKey: "gamma",
    type: "laptop",
    status: "Available",
    icon: Laptop,
  },
  {
    id: "2",
    title: "4K Laser Projector",
    sku: "FPT-PJ-014",
    location: "Resource Desk",
    locationKey: "gamma",
    type: "projector",
    status: "Available",
    icon: Video,
  },
  {
    id: "3",
    title: "iPad Air 5th Gen",
    sku: "FPT-TAB-055",
    location: "Library A",
    locationKey: "alpha",
    type: "tablet",
    status: "In Use",
    icon: TabletSmartphone,
  },
  {
    id: "4",
    title: "UltraWide Monitor",
    sku: "FPT-MN-033",
    location: "Room 205",
    locationKey: "gamma",
    type: "monitor",
    status: "Available",
    icon: Monitor,
  },
  {
    id: "5",
    title: "Sony A7 IV Camera",
    sku: "FPT-CAM-011",
    location: "Media Lab",
    locationKey: "alpha",
    type: "camera",
    status: "Available",
    icon: Camera,
  },
  {
    id: "6",
    title: "Focusrite Interface",
    sku: "FPT-AUD-007",
    location: "Studio B",
    locationKey: "alpha",
    type: "audio",
    status: "Available",
    icon: Mic,
  },
  {
    id: "7",
    title: "Dell XPS 15",
    sku: "FPT-LAP-097",
    location: "Lab Room 408",
    locationKey: "gamma",
    type: "laptop",
    status: "Maintenance",
    icon: Laptop,
  },
  {
    id: "8",
    title: "Epson Smart Projector",
    sku: "FPT-PJ-022",
    location: "Seminar Room A",
    locationKey: "alpha",
    type: "projector",
    status: "Available",
    icon: Video,
  },
  {
    id: "9",
    title: "Samsung Galaxy Tab S9",
    sku: "FPT-TAB-061",
    location: "Library B",
    locationKey: "alpha",
    type: "tablet",
    status: "Available",
    icon: TabletSmartphone,
  },
  {
    id: "10",
    title: "LG 4K Display",
    sku: "FPT-MN-044",
    location: "Room 301",
    locationKey: "gamma",
    type: "monitor",
    status: "In Use",
    icon: Monitor,
  },
  {
    id: "11",
    title: "Canon EOS R6",
    sku: "FPT-CAM-019",
    location: "Media Lab",
    locationKey: "alpha",
    type: "camera",
    status: "In Use",
    icon: Camera,
  },
  {
    id: "12",
    title: "Shure MV7 Mic",
    sku: "FPT-AUD-013",
    location: "Podcast Room",
    locationKey: "gamma",
    type: "audio",
    status: "Available",
    icon: Mic,
  },
];

const ITEMS_PER_PAGE = 4;

// Category id → EquipmentType (or 'all')
const CATEGORY_TO_TYPE: Record<string, string> = {
  all: "all-types",
  laptop: "laptop",
  projector: "projector",
  tablet: "tablet",
  monitor: "monitor",
  camera: "camera",
  audio: "audio",
};

const TYPE_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_TYPE).map(([k, v]) => [v, k]),
);

// ─── Component ────────────────────────────────────────────────────────────────

export const EquipmentCatalog: React.FC = () => {
  const navigate = useNavigate();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Borrow modal state ────────────────────────────────────────────────────
  const [borrowingItem, setBorrowingItem] = useState<EquipmentItem | null>(
    null,
  );
  const [returnDate, setReturnDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [formError, setFormError] = useState("");

  // ── Sync category ↔ type dropdown ─────────────────────────────────────────
  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setActiveCategory(TYPE_TO_CATEGORY[val] ?? "all");
    setCurrentPage(1);
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setTypeFilter(CATEGORY_TO_TYPE[id] ?? "all-types");
    setCurrentPage(1);
  };

  const handleFilter = () => {
    setCurrentPage(1);
  };

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filteredEquipment = useMemo(() => {
    return ALL_EQUIPMENT.filter((item) => {
      const q = searchText.toLowerCase();
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.sku.toLowerCase().includes(q)
      )
        return false;
      if (
        typeFilter !== "all-types" &&
        item.type !== (typeFilter as EquipmentType)
      )
        return false;
      if (
        locationFilter !== "all-locations" &&
        item.locationKey !== (locationFilter as LocationKey)
      )
        return false;
      return true;
    });
  }, [searchText, typeFilter, locationFilter]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedItems = filteredEquipment.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Borrow modal ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86_400_000)
    .toISOString()
    .split("T")[0];

  const openBorrowModal = (item: EquipmentItem) => {
    setBorrowingItem(item);
    setReturnDate(tomorrow);
    setPurpose("");
    setFormError("");
  };

  const closeBorrowModal = () => {
    setBorrowingItem(null);
    setFormError("");
  };

  const handleSubmitBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      setFormError("Please select a return date.");
      return;
    }
    if (!purpose.trim()) {
      setFormError("Please enter the purpose of borrowing.");
      return;
    }

    navigate("/lecturer/approval", {
      state: {
        newBorrowRequest: {
          equipmentId: borrowingItem!.id,
          equipmentTitle: borrowingItem!.title,
          equipmentSku: borrowingItem!.sku,
          location: borrowingItem!.location,
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

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (
        let i = Math.max(2, safePage - 1);
        i <= Math.min(totalPages - 1, safePage + 1);
        i++
      )
        pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <nav className="mb-[2rem] flex flex-wrap items-center justify-center gap-[0.5rem] md:mb-[4rem] md:gap-[0.75rem]">
        <button
          onClick={() => handlePageChange(safePage - 1)}
          disabled={safePage === 1}
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800/40"
        >
          <span className="material-symbols-outlined text-[1.125rem]">
            chevron_left
          </span>
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-[2.75rem] w-[2.75rem] items-center justify-center text-[1rem] text-[#1E2B58] opacity-40 dark:text-white"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p as number)}
              className={`flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full text-[1rem] font-bold transition-all hover:scale-105 active:scale-95 ${
                safePage === p
                  ? "bg-[#1E2B58] text-white shadow-lg shadow-[#1E2B58]/20"
                  : "text-[#1E2B58] hover:bg-white/40 dark:text-white dark:hover:bg-slate-800/40"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => handlePageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800/40"
        >
          <span className="material-symbols-outlined text-[1.125rem]">
            chevron_right
          </span>
        </button>
      </nav>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-7xl">
        {/* Header */}
        <section className="mb-[2.5rem] md:mb-[3.5rem]">
          <h2 className="mb-[0.75rem] text-[2.25rem] leading-tight font-extrabold text-[#1E2B58] sm:text-[2.75rem] md:text-[3.5rem] dark:text-white">
            Equipment Catalog
          </h2>
          <p className="max-w-2xl text-[1rem] font-medium text-[#1E2B58]/60 sm:text-[1.125rem] dark:text-white/60">
            Explore and reserve university resources with our enhanced Lecturer
            Portal.
          </p>
        </section>

        {/* Filter bar */}
        <EquipmentFilter
          searchText={searchText}
          onSearchChange={(val) => {
            setSearchText(val);
            setCurrentPage(1);
          }}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          locationFilter={locationFilter}
          onLocationChange={(val) => {
            setLocationFilter(val);
            setCurrentPage(1);
          }}
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
          onViewHistory={() => navigate("/lecturer/history")}
          onItemClick={() => navigate("/lecturer/history")}
        />

        {/* Pagination */}
        {renderPageButtons()}
      </main>

      {/* ── Borrow Request Modal ───────────────────────────────────────── */}
      {borrowingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeBorrowModal();
          }}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-[2rem] p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
            {/* Close button */}
            <button
              onClick={closeBorrowModal}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal header */}
            <div className="mb-6">
              <p className="mb-1 text-[0.625rem] font-black tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                Borrow Request
              </p>
              <h3 className="text-2xl leading-tight font-black text-[#1E2B58] dark:text-white">
                {borrowingItem.title}
              </h3>
              <p className="mt-1 text-xs font-bold tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                {borrowingItem.sku} • {borrowingItem.location}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBorrow} className="flex flex-col gap-5">
              {/* Return date */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Return Date
                </label>
                <input
                  type="date"
                  required
                  min={tomorrow}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-[1rem] border border-white/40 bg-white/40 px-4 py-3 text-sm font-bold text-[#1E2B58] transition-all outline-none focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white"
                />
              </div>

              {/* Purpose */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
                  <FileText className="h-3.5 w-3.5" />
                  Purpose of Borrowing
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Teaching demo for CS101 lecture..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full resize-none rounded-[1rem] border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] transition-all outline-none placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30"
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 dark:text-red-400">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeBorrowModal}
                  className="flex-1 rounded-[1.25rem] border border-[#1E2B58]/20 py-3.5 text-sm font-bold text-[#1E2B58]/70 transition-all hover:bg-[#1E2B58]/5 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-[2] items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1E2B58]/30 active:scale-95"
                >
                  Submit Request
                  <ArrowRight className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
