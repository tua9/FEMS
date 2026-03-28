import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Laptop, Cable, Router, Mic, Microchip, Projector } from 'lucide-react';
import { formatDisplayDate } from "@/utils/dateUtils";
const getIcon = (category) => {
 if (!category) return Projector;
 const normalized = category.toLowerCase();
 if (normalized.includes('laptop') || normalized.includes('computer')) return Laptop;
 if (normalized.includes('cable')) return Cable;
 if (normalized.includes('network') || normalized.includes('router')) return Router;
 if (normalized.includes('audio') || normalized.includes('mic')) return Mic;
 if (normalized.includes('component') || normalized.includes('kit')) return Microchip;
 return Projector;
};

export function useHistoryController(ITEMS_PER_PAGE= 6) {
 // Stores
 const { user } = useAuthStore();
 const { borrowRequests, loading: borrowLoading, fetchMyBorrowRequests, cancelMyBorrowRequest } = useBorrowRequestStore();
 const { myReports, loading: reportLoading, fetchMyReports, cancelMyReport } = useReportStore();
 const [searchParams, setSearchParamsUrl] = useSearchParams();

 // State
 const initialTab = (searchParams.get("tab")) || "borrow";
 const [activeTab, setActiveTab] = useState(initialTab);
 const [searchTerm, setSearchTerm] = useState("");
 const [dateFilter, setDateFilter] = useState("Last 30 Days");
 const [statusFilter, setStatusFilter] = useState("All");
 
 const [reportPage, setReportPage] = useState(1);
 const [borrowPage, setBorrowPage] = useState(1);
 const [modal, setModal] = useState(null);
 const [cancelTargetItem, setCancelTargetItem] = useState(null);

 // Initial Fetch
 useEffect(() => {
 if (user?._id) {
 fetchMyBorrowRequests();
 fetchMyReports();
 }
 }, [user?._id, fetchMyBorrowRequests, fetchMyReports]);

 // Handlers
 const handleTabChange = (tab) => {
 const newTab = tab;
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

 // Open cancel modal for a specific borrow request
 const handleOpenCancelModal = (item) => {
 setCancelTargetItem(item);
 };

 // Called when user confirms with a reason from BorrowCancelModal
 const handleConfirmCancel = async (decisionNote)=> {
 if (!cancelTargetItem) return;
 // Re-throw so BorrowCancelModal can catch and display the error
 await cancelMyBorrowRequest(cancelTargetItem._id, decisionNote);
 setCancelTargetItem(null);
 };

 const handleCancelReport = async (item) => {
 if (!window.confirm(`Bạn có chắc muốn hủy báo cáo #${item._id.slice(-6).toUpperCase()}?`)) return;
 try {
 await cancelMyReport(item._id);
 } catch {
 // Error already stored in store
 }
 };

 const getEquipmentName = (eq) => eq ? (typeof eq === 'string' ? eq : eq.name) : '';
 const getRoomName = (room) => room ? (typeof room === 'string' ? room : room.name) : '';

 // Filter Reports
 const filteredReports = useMemo(() => {
 const q = searchTerm.toLowerCase();
 return myReports.filter((r) => {
 const eqName = getEquipmentName(r.equipment_id || r.equipmentId).toLowerCase();
 const rmName = getRoomName(r.room_id || r.roomId).toLowerCase();
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
 return borrowRequests.filter((b) => {
 const eqName = getEquipmentName(b.equipmentId).toLowerCase();
 const rmName = getRoomName(b.roomId).toLowerCase();
 
 const matchSearch = !q || b._id.toLowerCase().includes(q) || eqName.includes(q) || rmName.includes(q);

 const isOverdue = b.status === 'approved' && new Date(b.expectedReturnDate) < new Date();
 const displayStatus = isOverdue ? 'OVERDUE' : (b.status ? b.status.toUpperCase() : '');
 const matchStatus = statusFilter === "All" || displayStatus === statusFilter.toUpperCase();
 
 return matchSearch && matchStatus;
 });
 }, [borrowRequests, searchTerm, statusFilter]);

 // Pagination
 const reportPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
 const borrowPages = Math.max(1, Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE));

 const currentReportItems = filteredReports.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);
 const pagedBorrowItems = filteredBorrow.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);

 // Final mapping for UI
 const currentBorrowItems = useMemo(() => {
 return pagedBorrowItems.map((b)=> {
 const equipment = b.equipmentId && typeof b.equipmentId !== 'string' ? b.equipmentId : null;
 const room = b.roomId && typeof b.roomId !== 'string' ? b.roomId : null;
 
 const isOverdue = b.status === 'approved' && new Date(b.expectedReturnDate) < new Date();
 const displayStatus = (isOverdue ? 'OVERDUE' : (b.status || 'PENDING')).toUpperCase();

 return {
 id: `#${b._id.substring(b._id.length - 6).toUpperCase()}`,
 course: room ? room.name : 'Unknown Room',
 group: room ? (room.type || '') : '',
 equipmentName: equipment ? equipment.name : 'Infrastructure',
 icon: getIcon(equipment?.category),
 period: formatDisplayDate(b.borrowDate),
 returnDate: formatDisplayDate(b.expectedReturnDate),
 status: displayStatus,
 original: b
 };
 });
 }, [pagedBorrowItems]);

 return {
 state: {
 activeTab,
 searchTerm,
 dateFilter,
 statusFilter,
 reportPage,
 borrowPage,
 modal,
 cancelTargetItem,
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
 setCancelTargetItem,
 handleClearFilters,
 handleOpenCancelModal,
 handleConfirmCancel,
 handleCancelReport,
 }
 };
}
