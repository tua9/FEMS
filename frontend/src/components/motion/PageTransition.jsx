/**
 * PageTransition — Wrapper cũ, giữ lại để backward-compatible.
 * Bên trong dùng AnimatedPage (variant="fade").
 *
 * Cách dùng:
 * <PageTransition className="px-6 max-w-7xl mx-auto">
 * …
 * </PageTransition>
 */

import React from "react";
import { AnimatedPage } from "./AnimatedPage";
import clsx from "clsx";

export const PageTransition = ({
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
