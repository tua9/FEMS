/**
 * PageTransition — Wrapper cũ, giữ lại để backward-compatible.
 * Bên trong dùng AnimatedPage (variant="fade").
 *
 * Cách dùng:
 *   <PageTransition className="px-6 max-w-7xl mx-auto">
 *     …
 *   </PageTransition>
 */

import React from "react";
import { AnimatedPage } from "./AnimatedPage";
import type { MotionProps } from "framer-motion";
import clsx from "clsx";

type PageTransitionProps = {
  className?: string;
  children: React.ReactNode;
  variant?: "fade" | "curtain" | "slide";
} & Omit<MotionProps, "initial" | "animate" | "exit" | "variants">;

export const PageTransition: React.FC<PageTransitionProps> = ({
  className,
  children,
  variant = "fade",
}) => {
  return (
    <AnimatedPage variant={variant} className={clsx(className)}>
      {children}
    </AnimatedPage>
  );
};

