import { GitPullRequest, Search, Hash, LayoutList } from "lucide-react";

export default function Header({
  repo,
  setRepo,
  onSearch,
  perPage,
  setPerPage,
}: any) {
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val > 100) {
      alert("⚠️ GitHub API limit: Max 100 PRs per page.");
      setPerPage(100);
    } else {
      setPerPage(val || 1);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm z-30">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
            <GitPullRequest className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">
              PR Monitor
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
              GitHub Insight Tool
            </p>
          </div>
        </div>

        {/* Controls Group */}
        <div className="flex flex-1 w-full md:max-w-2xl items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {/* Repository Input */}
          <div className="flex-1 flex items-center gap-2 px-3 bg-white rounded-lg border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <LayoutList className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="user / repository"
              className="w-full py-2 text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Per Page Input */}
          <div className="flex items-center gap-1.5 px-3 bg-white rounded-lg border border-slate-200 shadow-sm w-24 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Hash className="w-2 h-2 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Limit
            </span>
            <input
              type="number"
              value={perPage}
              onChange={handleLimitChange}
              className="w-full py-2 text-sm font-bold text-slate-700 bg-transparent outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-100 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
