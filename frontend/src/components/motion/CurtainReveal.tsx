import React from "react";
import { motion, MotionProps } from "framer-motion";
import clsx from "clsx";

interface CurtainRevealProps extends Omit<MotionProps, "initial" | "animate"> {
  className?: string;
  children: React.ReactNode;
}

/**
 * Simple "curtain" / "màn trập" reveal for headers / sections.
 * - Animates height from 0 → auto with a soft fade.
 */
export const CurtainReveal: React.FC<CurtainRevealProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("overflow-hidden", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

