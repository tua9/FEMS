/**
 * AnimatedSection — Bọc 1 section/block trong trang, tự reveal khi vào viewport.
 *
 * Cách dùng:
 *   <AnimatedSection>
 *     <h2>Title</h2>
 *     <p>Content…</p>
 *   </AnimatedSection>
 *
 * Props:
 *   variant="fade"    → fade + slide Y (mặc định)
 *   variant="curtain" → màn trập clip-path
 *   delay={0.1}       → delay trước khi bắt đầu animate
 *   once={true}       → chỉ animate 1 lần (mặc định true)
 */

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type SectionVariant = "fade" | "curtain" | "slide-up";

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  delay?: number;
  once?: boolean;
  className?: string;
}

const buildVariants = (variant: SectionVariant, delay: number) => {
  const transition = {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay,
  };

  switch (variant) {
    case "curtain":
      return {
        hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition },
      };
    case "slide-up":
      return {
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0, transition },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition },
      };
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variant = "fade",
  delay = 0,
  once = true,
  className,
}) => {
  const variants = buildVariants(variant, delay);

  return (
    <motion.section
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={clsx("will-change-transform", className)}
    >
      {children}
    </motion.section>
  );
};
