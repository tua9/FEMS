/**
 * RouteTransitionWrapper — Bọc AnimatePresence quanh Outlet của react-router.
 *
 * Đặt component này trong mỗi Layout, thay thế `<Outlet />` thô.
 *
 * Cách dùng trong layout:
 * import { RouteTransitionWrapper } from "@/components/motion/RouteTransitionWrapper";
 *
 * export default function AdminLayout() {
 * return (
 * <div>
 * <AdminNavbar />
 * <RouteTransitionWrapper />
 * <AdminFooter />
 * </div>
 * );
 * }
 *
 * Các trang bên trong chỉ cần bọc nội dung bằng <AnimatedPage>:
 * export default function SomePage() {
 * return (
 * <AnimatedPage className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-20">
 * …
 * </AnimatedPage>
 * );
 * }
 */

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router";

export const RouteTransitionWrapper = ({
 className,
}) => {
 const location = useLocation();

 return (
 // mode="wait": trang cũ exit xong mới trang mới enter → mượt mà hơn
 <AnimatePresence mode="wait" initial={false}>
 <div key={location.pathname} className={className}>
 <Outlet />
 </div>
 </AnimatePresence>
 );
};
