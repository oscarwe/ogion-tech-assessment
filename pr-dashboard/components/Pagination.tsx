import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  setPage,
  hasMore,
  loading,
  count,
  isCached,
}: any) {
  return (
    <footer className="w-full bg-white border-t p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900">{count}</span> PRs
          </span>

          {!loading && isCached && (
            <span className="flex items-center gap-1.5 text-[10px] bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-bold uppercase tracking-wider transition-opacity">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Cached
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p: number) => p - 1)}
            className="flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-medium bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="flex items-center justify-center min-w-8 h-8 text-sm font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            {page}
          </span>

          <button
            disabled={!hasMore || loading}
            onClick={() => setPage((p: number) => p + 1)}
            className="flex items-center gap-1 px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-medium bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
