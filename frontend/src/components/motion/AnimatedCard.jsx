/**
 * AnimatedCard — Card có Shared Layout Animation (Magic Motion) + hover/tap.
 *
 * Cách dùng cơ bản:
 *   <AnimatedCard>
 *     <p>Content</p>
 *   </AnimatedCard>
 *
 * Cách dùng Magic Motion (Shared Layout):
 *   // Khi card "thu nhỏ" trong list
 *   <AnimatedCard layoutId={`card-${item.id}`} onClick={() => setSelected(item)}>
 *     <p>{item.title}</p>
 *   </AnimatedCard>
 *
 *   // Khi card "mở rộng" ra modal
 *   <AnimatePresence>
 *     {selected && (
 *       <AnimatedCard layoutId={`card-${selected.id}`} expanded>
 *         <FullDetail item={selected} />
 *       </AnimatedCard>
 *     )}
 *   </AnimatePresence>
 *
 * Framer Motion tự động tween vị trí/kích thước giữa 2 trạng thái.
 */

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { sharedLayoutTransition } from "./variants";


export const AnimatedCard = ({
  children,
  className,
  interactive = true,
  expanded = false,
  onClick,
  layoutId,
  ...rest
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      layout
      transition={sharedLayoutTransition}
      whileHover={interactive && !expanded ? { y: -3, scale: 1.015 } : undefined}
      whileTap={interactive && !expanded ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={clsx(
        interactive && !expanded && "cursor-pointer",
        expanded &&
          "fixed inset-0 z-50 m-auto max-h-[90vh] max-w-3xl overflow-auto rounded-3xl shadow-2xl",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
