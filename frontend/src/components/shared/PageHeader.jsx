/**
 * PageHeader — Unified centered page title & subtitle component.
 *
 * Renders a large gradient title + subtitle with a smooth fade-in-up animation.
 * Use this for the primary heading of every page in every role.
 *
 * Props:
 * title — Main heading text (required)
 * subtitle — Secondary description text (optional)
 * className — Extra classes on the root wrapper (optional)
 *
 * Example:
 * <PageHeader title="Hello, Alex Chen" subtitle="Welcome back to your University Dashboard." />
 */

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// Staggered fade-in-up for title and subtitle
const containerVariants = {
 hidden: {},
 visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
 hidden: { opacity: 0, y: 18 },
 visible: {
 opacity: 1,
 y: 0,
 transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
 },
};

export const PageHeader = ({
 title,
 subtitle,
 className,
}) => {
 return (
 <motion.div
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className={clsx(
 "mb-10 pt-4 sm:pt-6 flex flex-col items-center justify-center text-center",
 className,
 )}
 >
 {/* Title */}
 <motion.h1
 variants={itemVariants}
 className={[
 // gradient navy → blue, responsive size
 "bg-linear-to-r from-[#1E2B58] to-[#3a4c88]",
 "bg-clip-text text-transparent",
 "dark:from-white dark:to-slate-300",
 // size: mobile 1.875rem → sm 2.25rem → md 3rem
 "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]",
 "select-none",
 ].join(" ")}
 >
 {title}
 </motion.h1>

 {/* Subtitle */}
 {subtitle && (
 <motion.p
 variants={itemVariants}
 className="mt-3 text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400 max-w-2xl"
 >
 {subtitle}
 </motion.p>
 )}
 </motion.div>
 );
};

export default PageHeader;
