import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ArrowRight,
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  EquipmentFilter,
  EquipmentCategories,
  EquipmentGrid,
  BorrowedEquipmentGrid,
} from "@/components/shared/equipment";
import type {
  EquipmentItem,
  EquipmentType,
  LocationKey,
} from "@/components/shared/equipment";
import {
  ALL_EQUIPMENT,
  ITEMS_PER_PAGE,
  CATEGORY_TO_TYPE,
  TYPE_TO_CATEGORY,
} from "@/data/student/mockStudentEquipment";

const EquipmentPage: React.FC = () => {
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

  const tomorrow = new Date(Date.now() + 86_400_000)
    .toISOString()
    .split("T")[0];

  const openBorrowModal = (item: EquipmentItem) => {
    setBorrowingItem(item);
    setReturnDate(tomorrow);
    setPurpose("");
    setFormError("");
  };

  const closeBorrowModal = () => setBorrowingItem(null);

  const handleSubmitBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate || !purpose.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    navigate("/student/borrow-history");
  };

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-7xl">
        <header className="student-page-header">
          <h2>Equipment Catalog</h2>
          <p>
            Explore and reserve university resources with our enhanced Student
            Portal.
          </p>
        </header>

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
          onFilter={() => setCurrentPage(1)}
        />

        <EquipmentCategories
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <EquipmentGrid
          items={pagedItems}
          totalCount={filteredEquipment.length}
          onBorrowRequest={openBorrowModal}
        />

        <BorrowedEquipmentGrid
          onViewHistory={() => navigate("/student/borrow-history")}
          onItemClick={() => navigate("/student/borrow-history")}
        />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`h-10 w-10 rounded-full font-bold transition-all ${safePage === p ? "bg-[#1E2B58] text-white shadow-lg" : "text-[#1E2B58] hover:bg-white/40 dark:text-white dark:hover:bg-slate-800/40"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      {borrowingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeBorrowModal()}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-4xl p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
            <button
              onClick={closeBorrowModal}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-6">
              <p className="mb-1 text-[0.625rem] font-black tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                Borrow Request
              </p>
              <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white">
                {borrowingItem.title}
              </h3>
              <p className="mt-1 text-xs font-bold tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                {borrowingItem.sku} • {borrowingItem.location}
              </p>
            </div>
            <form onSubmit={handleSubmitBorrow} className="flex flex-col gap-5">
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
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-bold text-[#1E2B58] transition-all outline-none focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
                  <FileText className="h-3.5 w-3.5" />
                  Purpose
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Study group project..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] transition-all outline-none placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
              {formError && (
                <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500">
                  {formError}
                </p>
              )}
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeBorrowModal}
                  className="flex-1 rounded-[1.25rem] bg-white/20 py-3.5 text-sm font-bold text-[#1E2B58] hover:bg-white/40 dark:bg-slate-800/20 dark:text-white dark:hover:bg-slate-800/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-2 items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#1E2B58]/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Submit Request{" "}
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

export default EquipmentPage;
