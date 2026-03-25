/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FEMS — Shared Framer Motion Variants
 * Dùng chung cho TẤT CẢ role: admin | lecturer | student | technician
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Easing curves ────────────────────────────────────────────────────────────
export const EASE_SPRING= {
 type: "spring",
 stiffness: 380,
 damping: 30,
};

export const EASE_EXPO= {
 duration: 0.45,
 ease: [0.16, 1, 0.3, 1],
};

export const EASE_SMOOTH= {
 duration: 0.35,
 ease: [0.4, 0, 0.2, 1],
};

// ── Page transition (Fade + Slide Y) ─────────────────────────────────────────
export const pageVariants= {
 initial: { opacity: 0, y: 20 },
 enter: {
 opacity: 1,
 y: 0,
 transition: { ...EASE_EXPO, staggerChildren: 0.07 },
 },
 exit: {
 opacity: 0,
 y: -12,
 transition: { duration: 0.2, ease: "easeIn" },
 },
};

// ── Curtain Effect (màn trập — clip-path top→bottom) ─────────────────────────
export const curtainVariants= {
 initial: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
 enter: {
 clipPath: "inset(0 0 0% 0)",
 opacity: 1,
 transition,
 },
 exit: {
 clipPath: "inset(0 0 100% 0)",
 opacity: 0,
 transition: { duration: 0.25, ease: "easeIn" },
 },
};

// ── Slide & Overlay (ngăn kéo — từ phải/trái) ────────────────────────────────
export const slideRightVariants= {
 initial: { x: "100%", opacity: 0 },
 enter: { x: 0, opacity: 1, transition: EASE_EXPO },
 exit: { x: "100%", opacity: 0, transition: { duration: 0.25 } },
};

export const slideLeftVariants= {
 initial: { x: "-100%", opacity: 0 },
 enter: { x: 0, opacity: 1, transition: EASE_EXPO },
 exit: { x: "-100%", opacity: 0, transition: { duration: 0.25 } },
};

export const slideUpVariants= {
 initial: { y: "100%", opacity: 0 },
 enter: { y: 0, opacity: 1, transition: EASE_EXPO },
 exit: { y: "100%", opacity: 0, transition: { duration: 0.25 } },
};

// ── Overlay backdrop ─────────────────────────────────────────────────────────
export const overlayVariants= {
 initial: { opacity: 0 },
 enter: { opacity: 1, transition: { duration: 0.25 } },
 exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ── Stagger container (dùng cho list/grid) ────────────────────────────────────
export const staggerContainer= {
 initial: {},
 enter: {
 transition: { staggerChildren: 0.08, delayChildren: 0.05 },
 },
 exit: {
 transition: { staggerChildren: 0.04, staggerDirection: -1 },
 },
};

// ── Stagger child item ────────────────────────────────────────────────────────
export const staggerItem= {
 initial: { opacity: 0, y: 18 },
 enter: {
 opacity: 1,
 y: 0,
 transition,
 },
 exit: {
 opacity: 0,
 y: -10,
 transition: { duration: 0.18 },
 },
};

// ── Fade in only ─────────────────────────────────────────────────────────────
export const fadeVariants= {
 initial: { opacity: 0 },
 enter: { opacity: 1, transition: { duration: 0.3 } },
 exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ── Scale pop (cho modal, card expand) ───────────────────────────────────────
export const scalePopVariants= {
 initial: { opacity: 0, scale: 0.94 },
 enter: {
 opacity: 1,
 scale: 1,
 transition,
 },
 exit: {
 opacity: 0,
 scale: 0.96,
 transition: { duration: 0.18 },
 },
};

// ── Shared Layout Magic Motion — dùng với layoutId ───────────────────────────
// Chỉ cần đặt layoutId="same-key" trên 2 element để Framer tự animate
export const sharedLayoutTransition= {
 type: "spring",
 stiffness: 400,
 damping: 35,
};
