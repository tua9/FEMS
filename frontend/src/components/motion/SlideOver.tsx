import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export type SlideOverSide = "left" | "right";

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  side?: SlideOverSide;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable slide-over / drawer panel.
 * - Used for filters, details side panels… across all roles.
 */
export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  side = "right",
  className,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className={clsx(
              "fixed z-50 top-0 h-full w-full max-w-md bg-white/95 dark:bg-slate-900/95 border-l border-slate-200/70 dark:border-slate-700/80 shadow-2xl flex flex-col",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
            initial={{ x: side === "right" ? 480 : -480 }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? 480 : -480 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

