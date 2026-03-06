import React from "react";
import { motion, MotionProps } from "framer-motion";
import clsx from "clsx";

type PageTransitionProps = {
  className?: string;
  children: React.ReactNode;
} & Omit<MotionProps, "initial" | "animate" | "exit">;

/**
 * Shared animated page wrapper used across ALL roles.
 * - Fades & slides content in on mount
 * - Can be reused in any page instead of a plain <main>
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  className,
  children,
  ...motionProps
}) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("motion-safe:will-change-transform", className)}
      {...motionProps}
    >
      {children}
    </motion.main>
  );
};

