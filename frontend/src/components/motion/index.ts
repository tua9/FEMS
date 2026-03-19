// ── Primitives ────────────────────────────────────────────────────────────────
export { AnimatedPage } from "./AnimatedPage";
export { AnimatedSection } from "./AnimatedSection";
export { AnimatedList, AnimatedListItem } from "./AnimatedList";
export { AnimatedCard } from "./AnimatedCard";
export { RouteTransitionWrapper } from "./RouteTransitionWrapper";
export { PageShell } from "./PageShell";

// ── Shared UI ─────────────────────────────────────────────────────────────────
export { PageHeader } from "@/components/shared/PageHeader";

// ── Legacy (backward-compatible) ─────────────────────────────────────────────
export { PageTransition } from "./PageTransition";
export { SlideOver } from "./SlideOver";
export { CurtainReveal } from "./CurtainReveal";

// ── Variants & transitions (dùng trực tiếp nếu cần) ──────────────────────────
export {
  pageVariants,
  curtainVariants,
  slideRightVariants,
  slideLeftVariants,
  slideUpVariants,
  overlayVariants,
  staggerContainer,
  staggerItem,
  fadeVariants,
  scalePopVariants,
  sharedLayoutTransition,
  EASE_SPRING,
  EASE_EXPO,
  EASE_SMOOTH,
} from "./variants";

