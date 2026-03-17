/**
 * AnimatedList — Stagger container cho danh sách/grid items.
 *
 * Cách dùng:
 *   <AnimatedList>
 *     {items.map(item => (
 *       <AnimatedListItem key={item.id}>
 *         <Card>…</Card>
 *       </AnimatedListItem>
 *     ))}
 *   </AnimatedList>
 *
 * Tự stagger từng item theo thứ tự.
 */

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { staggerContainer, staggerItem } from "./variants";

// ── Container ─────────────────────────────────────────────────────────────────
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  /** Nếu true, chỉ animate khi vào viewport */
  inView?: boolean;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className,
  inView = false,
}) => {
  if (inView) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="enter"
        viewport={{ once: true, margin: "-30px" }}
        className={clsx(className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="enter"
      exit="exit"
      className={clsx(className)}
    >
      {children}
    </motion.div>
  );
};

// ── Item ──────────────────────────────────────────────────────────────────────
interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      variants={staggerItem}
      className={clsx(className)}
    >
      {children}
    </motion.div>
  );
};
