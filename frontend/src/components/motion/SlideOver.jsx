/**
 * SlideOver — Ngăn kéo slide-in từ trái/phải với backdrop overlay.
 *
 * Cách dùng:
 * const [open, setOpen] = useState(false);
 *
 * <SlideOver isOpen={open} onClose={() => setOpen(false)} side="right">
 * <div className="p-6">
 * <h2>Panel Title</h2>
 * </div>
 * </SlideOver>
 */

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { slideRightVariants, slideLeftVariants, overlayVariants } from "./variants";

/**
 * Reusable slide-over / drawer panel.
 * - Used for filters, details side panels… across all roles.
 */
export const SlideOver = ({
 isOpen,
 onClose,
 side = "right",
 className,
 children,
 width = "max-w-md",
}) => {
 const slideVariants = side === "right" ? slideRightVariants : slideLeftVariants;

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* ── Backdrop overlay ── */}
 <motion.div
 variants={overlayVariants}
 initial="initial"
 animate="enter"
 exit="exit"
 className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
 onClick={onClose}
 />

 {/* ── Panel ── */}
 <motion.aside
 variants={slideVariants}
 initial="initial"
 animate="enter"
 exit="exit"
 className={clsx(
 "fixed top-0 z-50 h-full w-full bg-white/95 shadow-2xl",
 "flex flex-col border-slate-200/70",
 "dark:bg-slate-900/95 dark:border-slate-700/80",
 side === "right"
 ? "right-0 border-l rounded-l-2xl"
 : "left-0 border-r rounded-r-2xl",
 width,
 className,
 )}
 >
 {children}
 </motion.aside>
 </>
 )}
 </AnimatePresence>
 );
};
