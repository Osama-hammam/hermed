import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-1 md:gap-2 mt-12 py-4 animate-fade-in"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 shadow-sm"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 md:gap-1.5 px-1 md:px-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-11 h-11 md:w-10 md:h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
              currentPage === p
                ? "bg-brand-600 text-white shadow-lg shadow-brand-200 ring-2 ring-brand-600 ring-offset-2"
                : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:text-brand-600"
            }`}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>
  );
}
