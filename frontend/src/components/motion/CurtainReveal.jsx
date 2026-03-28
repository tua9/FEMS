/**
 * CurtainReveal — Hiệu ứng màn trập cho header / sections khi vào viewport.
 *
 * Cách dùng:
 * <CurtainReveal>
 * <h1>Page Title</h1>
 * </CurtainReveal>
 */

import React from "react";
import { AnimatedSection } from "./AnimatedSection";
import clsx from "clsx";

export const CurtainReveal = ({
 className,
 children,
 delay = 0,
 once = true,
}) => {
 return (
 <AnimatedSection
 variant="curtain"
 delay={delay}
 once={once}
 className={clsx("overflow-hidden", className)}
 >
 {children}
 </AnimatedSection>
 );
};
