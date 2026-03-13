import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { BorrowRequest } from "@/types/borrowRequest";
import type { Report } from "@/types/report";
import type { ModalItem } from "@/components/student/history/HistoryDetailModal";

export type Tab = "report" | "borrow";

export function useHistoryController(ITEMS_PER_PAGE: number = 6) {
  // Stores
  const { user } = useAuthStore();
  const { borrowRequests, loading: borrowLoading, fetchMyBorrowRequests } = useBorrowRequestStore();
  const { myReports, loading: reportLoading, fetchMyReports } = useReportStore();
  const [searchParams, setSearchParamsUrl] = useSearchParams();

  // State
  const initialTab = (searchParams.get("tab") as Tab) || "borrow";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [reportPage, setReportPage] = useState(1);
  const [borrowPage, setBorrowPage] = useState(1);
  const [modal, setModal] = useState<ModalItem | null>(null);

  // Initial Fetch
  useEffect(() => {
    if (user?._id) {
      fetchMyBorrowRequests();
      fetchMyReports();
    }
  }, [user?._id, fetchMyBorrowRequests, fetchMyReports]);

  // Handlers
  const handleTabChange = (tab: any) => {
    const newTab = tab as Tab;
    setActiveTab(newTab);
    setSearchParamsUrl({ tab: newTab }, { replace: true });
    
    setSearchTerm("");
    setStatusFilter("All");
    setReportPage(1);
    setBorrowPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const getEquipmentName = (eq: any) => eq ? (typeof eq === 'string' ? eq : eq.name) : '';
  const getRoomName = (room: any) => room ? (typeof room === 'string' ? room : room.name) : '';

  // Filter Reports
  const filteredReports = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return myReports.filter((r: Report) => {
      const eqName = getEquipmentName(r.equipment_id).toLowerCase();
      const rmName = getRoomName(r.room_id).toLowerCase();
      const typeMatches = r.type && r.type.toLowerCase().includes(q);
      
      const matchSearch = !q || r._id.toLowerCase().includes(q) || eqName.includes(q) || rmName.includes(q) || typeMatches;
      
      const statusValue = r.status ? r.status.toUpperCase() : '';
      const matchSeverity = statusFilter === "All" || statusValue === statusFilter.toUpperCase();
      
      return matchSearch && matchSeverity;
    });
  }, [myReports, searchTerm, statusFilter]);

  // Filter Borrow Requests
  const filteredBorrow = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return borrowRequests.filter((b: BorrowRequest) => {
      const eqName = getEquipmentName(b.equipment_id).toLowerCase();
      const rmName = getRoomName(b.room_id).toLowerCase();
      
      const matchSearch = !q || b._id.toLowerCase().includes(q) || eqName.includes(q) || rmName.includes(q);

      const isOverdue = b.status === 'approved' && new Date(b.return_date) < new Date();
      const displayStatus = isOverdue ? 'OVERDUE' : (b.status ? b.status.toUpperCase() : '');
      const matchStatus = statusFilter === "All" || displayStatus === statusFilter.toUpperCase();
      
      return matchSearch && matchStatus;
    });
  }, [borrowRequests, searchTerm, statusFilter]);

  // Pagination
  const reportPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
  const borrowPages = Math.max(1, Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE));

  const currentReportItems = filteredReports.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);
  const currentBorrowItems = filteredBorrow.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);

  return {
    state: {
      activeTab,
      searchTerm,
      dateFilter,
      statusFilter,
      reportPage,
      borrowPage,
      modal,
      filteredReports,
      filteredBorrow,
      reportPages,
      borrowPages,
      currentReportItems,
      currentBorrowItems,
      isLoading: borrowLoading || reportLoading
    },
    actions: {
      handleTabChange,
      setSearchTerm,
      setDateFilter,
      setStatusFilter,
      setReportPage,
      setBorrowPage,
      setModal,
      handleClearFilters
    }
  };
}
