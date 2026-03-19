import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    /** Số trang hiển thị mỗi bên quanh trang hiện tại, mặc định là 2 */
    delta?: number;
}

/**
 * Component phân trang tái sử dụng.
 * Hiển thị trang đầu, cuối và một nhóm trang quanh trang hiện tại.
 * Tự động thêm dấu "···" khi có khoảng trống.
 *
 * @example
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 */
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    delta = 2,
}) => {
    if (totalPages <= 1) return null;

    // Tạo mảng các trang cần hiển thị, thêm 'ellipsis' khi có khoảng trống
    const pages: (number | 'ellipsis')[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            pages.push(i);
        } else if (
            (i === left - 1 && left - 1 > 1) ||
            (i === right + 1 && right + 1 < totalPages)
        ) {
            pages.push('ellipsis');
        }
    }

    const btnBase =
        'w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-all';
    const btnActive = 'bg-[#1A2B56] text-white shadow-md';
    const btnIdle =
        'bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600';
    const btnNav =
        'bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300';

    return (
        <div className="flex items-center gap-2">
            {/* Prev */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`${btnBase} ${btnNav} ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600'}`}
                aria-label="Previous page"
            >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            {/* Page buttons / ellipsis */}
            {pages.map((page, idx) =>
                page === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm font-semibold select-none"
                    >
                        ···
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`${btnBase} ${currentPage === page ? btnActive : btnIdle}`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`${btnBase} ${btnNav} ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600'}`}
                aria-label="Next page"
            >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
        </div>
    );
};

export default Pagination;
