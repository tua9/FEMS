/**
 * AnimatedPage — Wrapper bọc nội dung trang với hiệu ứng transition.
 *
 * Cách dùng:
 *   <AnimatedPage>
 *     <YourPageContent />
 *   </AnimatedPage>
 *
 * Hỗ trợ 3 chế độ:
 *   variant="fade"    → fade + slide Y (mặc định)
 *   variant="curtain" → màn trập clip-path
 *   variant="slide"   → slide từ phải vào
 */

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  pageVariants,
  curtainVariants,
  slideRightVariants,
} from "./variants";
import type { Variants } from "framer-motion";

type PageVariant = "fade" | "curtain" | "slide";

interface AnimatedPageProps {
  children: React.ReactNode;
  variant?: PageVariant;
  className?: string;
}

const VARIANT_MAP: Record<PageVariant, Variants> = {
  fade: pageVariants,
  curtain: curtainVariants,
  slide: slideRightVariants,
};

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  variant = "fade",
  className,
}) => {
  return (
    <motion.div
      variants={VARIANT_MAP[variant]}
      initial="initial"
      animate="enter"
      exit="exit"
      className={clsx("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
};
