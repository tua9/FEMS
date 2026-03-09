/**
 * PageShell — Khung bố cục chuẩn cho TẤT CẢ trang, mọi role.
 *
 * Tự động:
 *  ✅ Bọc AnimatedPage (fade/curtain/slide)
 *  ✅ Giới hạn max-width + padding chuẩn
 *  ✅ Render tiêu đề trang + subtitle với CurtainReveal
 *  ✅ Render breadcrumb nếu truyền vào
 *
 * Cách dùng:
 *   <PageShell
 *     title="Equipment Management"
 *     subtitle="Manage all equipment in the system"
 *     breadcrumbs={[
 *       { label: "Dashboard", href: "/admin" },
 *       { label: "Equipment" },
 *     ]}
 *     action={<Button>Add New</Button>}
 *   >
 *     <YourContent />
 *   </PageShell>
 */

import React from "react";
import clsx from "clsx";
import { AnimatedPage } from "./AnimatedPage";
import { AnimatedSection } from "./AnimatedSection";
import { AnimatedList, AnimatedListItem } from "./AnimatedList";
import { Link } from "react-router";

// ── Breadcrumb ──────────────────────────────────────────────────────────────
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <AnimatedList className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-4">
    {items.map((item, i) => (
      <AnimatedListItem key={i} className="flex items-center gap-1.5">
        {i > 0 && (
          <span className="text-slate-300 dark:text-slate-600 select-none">/</span>
        )}
        {item.href ? (
          <Link
            to={item.href}
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-slate-600 dark:text-slate-300 font-semibold">
            {item.label}
          </span>
        )}
      </AnimatedListItem>
    ))}
  </AnimatedList>
);

// ── PageShell ────────────────────────────────────────────────────────────────
type PageVariant = "fade" | "curtain" | "slide";

interface PageShellProps {
  children: React.ReactNode;
  /** Tiêu đề chính của trang */
  title?: string;
  /** Mô tả nhỏ bên dưới title */
  subtitle?: string;
  /** Breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Nút hành động góc phải header */
  action?: React.ReactNode;
  /** Loại animation khi trang load */
  variant?: PageVariant;
  /** Override className container ngoài cùng */
  className?: string;
  /** Override className phần content bên dưới header */
  contentClassName?: string;
  /** pt- cho main (vì có navbar fixed), mặc định pt-28 */
  topPadding?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  action,
  variant = "fade",
  className,
  contentClassName,
  topPadding = "pt-28",
}) => {
  const hasHeader = title || subtitle || breadcrumbs || action;

  return (
    <AnimatedPage
      variant={variant}
      className={clsx(
        "min-h-screen",
        topPadding,
        "pb-20 px-4 sm:px-6",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* ── Page Header ── */}
        {hasHeader && (
          <AnimatedSection variant="curtain" delay={0} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <Breadcrumb items={breadcrumbs} />
                )}
                {title && (
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#1A2B56] dark:text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && (
                <div className="shrink-0">{action}</div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* ── Page Content ── */}
        <div className={clsx(contentClassName)}>{children}</div>
      </div>
    </AnimatedPage>
  );
};
